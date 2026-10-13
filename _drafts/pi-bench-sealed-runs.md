---
title: "Niêm phong benchmark xong, điểm giảm từ 45 xuống 42 — và lần này mình tin con số hơn"
categories: blog
classes: wide
tags:
  - vietnamese
  - pi
  - swe-bench
  - benchmark
  - harness
  - sandbox
toc: true
toc_label: "Table of Contents"
toc_icon: "cog"
header:
  teaser: "/images/pi-bench-dashboard.png"
  overlay_image: "/images/pi-bench-dashboard.png"
  overlay_filter: 0.7
  overlay_color: "#005eff"
---

Ở [bài trước]({% post_url blog/2026-09-19-pi-bench-harness-iterations %}), Pi harness của mình lên được **45/50** trên SWE-bench Verified Mini. Nhưng mình cũng tự thú là con số đó bị thổi phồng một lượng chưa biết: container vẫn có internet, và agent đã `pip download` bản Django/Sphinx mới hơn — bản đã chứa sẵn fix — ở ít nhất 9–10 task mỗi run. Cuối bài mình liệt kê một danh sách "việc tiếp theo", đứng đầu là **chặn network egress**.

Bài này kể lại chuyện gì xảy ra khi mình làm đúng việc đó: niêm phong benchmark, cho agent dùng được skill và subagent trong container, rồi chạy lại hai lần nữa với cùng model `deepseek/deepseek-v4-flash-0731` và cùng 50 task. Kết quả là điểm **giảm**, mỗi task chạy **chậm gấp đôi**, và một nửa thời gian của mình là đi tìm xem cái chậm đó đến từ đâu :)

Xem những phần trước:
- Phần 1: [Pi coding agent của mình đạt 35/50 SWE-bench Verified Mini — nhưng 15 task fail mới là phần thú vị]({% post_url blog/2026-09-12-pi-coding-agent-setup %})
- Phần 2: [Từ 70% lên 90% trên SWE-bench Verified Mini — nhưng cái gì đã work, cái gì không]({% post_url blog/2026-09-19-pi-bench-harness-iterations %})

# Tổng quan kết quả

| Run | Ngày chạy | Pass rate (50 task) | Trên 48 task hợp lệ | Note |
| --- | --- | --- | --- | --- |
| v1 | 29–30/08 | 35/50 = 70.0% | 72.9% | Harness gốc |
| v2 | 14/09 | 44/50 = 88.0% | 91.7% | Harness mới + verification retry |
| v2.1 | 16–17/09 | 45/50 = 90.0% | 93.8% | Làm cứng benchmark runner |
| **v3.1** | 25–26/09 | 43/50 = 86.0% | 89.6% | **Niêm phong** + skill/subagent chạy được + AGENTS.md v3.1 |
| **v3.2** | 27–28/09 | 42/50 = 84.0% | 87.5% | Sửa những gì v3.1 làm lộ ra (pi-bench `v1.1.0`, pi-config `v3.2`) |

Tên run mình đặt theo tag của [pi-config](https://github.com/hllj/pi-config) (harness), vì harness là thứ thay đổi giữa các run. Hai task có dữ liệu hỏng từ dataset (`django-12209`, `sphinx-8265`) vẫn bị loại khỏi mẫu số như bài trước.

> **TL;DR** — Sau khi niêm phong, agent vẫn *thử* tải code upstream (`pip download sphinx==…`), nhưng lần này bị chặn. Điểm đi từ 45/48 xuống 43/48 rồi 42/48 — nghe thì tệ, nhưng chênh lệch giữa ba run vẫn nằm trong vùng nhiễu (McNemar p ≥ 0.38), nên phần thổi phồng do rò rỉ upstream hoá ra **nhỏ hơn mình lo**. Cái thực sự tệ là thời gian: mỗi task chậm gấp đôi. Mình tìm ra bốn nguyên nhân, sửa được hai trong số đó ở harness/runner, còn nguyên nhân lớn nhất lại nằm ngoài tầm tay: provider trên OpenRouter sinh token chậm hơn gần một nửa so với tuần trước. Và hai bản sửa mình rất tự tin — LSP offline và reviewer không timeout — **đều không hoạt động** khi chạy thật.

# Danh sách "việc tiếp theo" đã làm đến đâu

| Việc mình hứa ở bài trước | Trạng thái |
| --- | --- |
| 1. Chặn network egress, chỉ để lại LLM API | ✅ Xong — "sealed mode" (phần 1 bên dưới) |
| 2. Sửa lỗi runner ảnh hưởng tới điểm | 🟡 Một phần — chấm điểm giờ chạy trong container mới, sạch (phần 1) |
| 3. Tách pass lần đầu và pass sau retry; sửa `summary.json` | 🟡 Một phần — `durationMs` đã tính cả retry; `summary.json` vẫn đếm mỗi task hai lần |
| 4. Chạy mỗi cấu hình ít nhất 3 lần | ❌ Chưa — v3.1 và v3.2 vẫn là hai lần chạy đơn, khác cấu hình |
| 5. Cho agent gọi được skill và subagent trong Docker | ✅ Xong (phần 2) |
| 6. Thử benchmark khác | ❌ Chưa |

# 1. Niêm phong benchmark

## Agent đã "trick lỏ" bằng những đường nào

Bài trước mình chỉ thấy `pip download`. Khi đọc lại kỹ hơn để chặn cho đủ, danh sách đường rò rỉ dài hơn mình nghĩ:

- **Network**: `pip download` bản mới hơn, `curl` file từ `raw.githubusercontent.com`, gọi GitHub API để đọc issue/PR của chính bug đang sửa.
- **Lời giải nằm ngay trong container**: runner cũ mount *toàn bộ* repo pi-bench vào container, và file task (`tasks/*.json`) chứa luôn trường `expectedDiff` — tức gold patch. Agent chỉ cần một lệnh `cat`. Mình chưa rà transcript để biết agent có từng làm vậy không, nhưng một benchmark không nên dựa vào việc agent "không nghĩ ra".
- **Chấm điểm trong chính container của agent**: agent có quyền root trong container, nên về lý thuyết nó có thể thả một file `sitecustomize.py` làm mọi test thành no-op, hoặc ghi đè file kết quả.

## Sealed mode làm gì

Mình viết lại runner (`run-swe-bench.sh`) để mặc định chạy "sealed":

1. Container của agent nằm trong một Docker network `--internal`: **không có đường ra internet**.
2. Lối ra duy nhất là một container proxy riêng. Nó chặn mọi thứ (`pip`, `git`, `curl`, Python — bất kể process nào), và ghi log từng request bị chặn vào nơi agent không với tới.
3. Gọi LLM đi qua một **gateway giữ API key**: container của agent không có key nào cả. Gateway chỉ forward đúng model đang được benchmark và từ chối các tính năng web search.
4. Chỉ mount code của harness (read-only). File task được đưa vào **sau khi xoá `expectedDiff`**, và bị xoá ngay khi harness đọc xong.
5. **Chấm điểm trong một container mới tinh** từ image gốc, `--network none`: chỉ áp diff của agent rồi chạy test ẩn. Diff nào thêm `sitecustomize.py`, `.pth` hay `conftest.py` lạ bị loại (`tamper-rejected`).

## Kết quả: agent vẫn thử, nhưng lần này bị chặn

Ngay run đầu tiên sau khi niêm phong (v3.1), agent vẫn làm đúng trò cũ:

```bash
pip download sphinx==4.1.0 --no-deps -d /tmp/x
```

Khác biệt là lệnh này giờ fail. Số task có hành vi "đi tìm lời giải upstream" bị phát hiện: **2/50 ở v3.1, 1/50 ở v3.2** — và cả ba lần đều bị chặn. So với bài trước: **≥ 9–10 task mỗi run tải thành công**.

Vậy niêm phong làm điểm giảm bao nhiêu? Câu trả lời trung thực là: **khó tách được, nhưng không nhiều**. Từ v2.1 (45/48) sang v3.2 (42/48) có 1 task chuyển fail → pass và 4 task pass → fail, McNemar exact p = 0.38. Nghĩa là với một lần chạy đơn, mình không phân biệt được chênh lệch này với nhiễu — trong khi giữa hai run thì còn đổi cả AGENTS.md, subagent, và (như phần 3 cho thấy) cả tốc độ của provider. Kết luận mình dám nói: phần thổi phồng do rò rỉ upstream ở bài trước **cỡ vài task, không phải vài chục điểm phần trăm**. Và 42–43/48 là con số mình tin hơn 45/48, vì lần này mình biết agent không có đường tắt nào còn mở.

# 2. Skill và subagent cuối cùng đã chạy

Bài trước có một câu viết hoa: **AGENT KHÔNG SỬ DỤNG ĐƯỢC SKILL VÀ CÁC TOOL KHÁC NHƯ SUBAGENT**. Trong 150 transcript không có một lời gọi skill hay subagent nào.

Hoá ra một phần lớn là do môi trường, đúng như mình nghi. Subagent của mình chạy mỗi agent con thành một process `pi` riêng, và trong container của SWE-bench thì:

- Process con không có cấu hình model (file `models.json` được harness cha ghi lại trong bộ nhớ, process con không đọc được) — trong sealed mode nó còn không có key lẫn đường tới gateway.
- File định nghĩa agent có thể ghim model riêng (reviewer chạy GLM, planner chạy model khác…). Trong benchmark, điều đó nghĩa là một model thứ hai góp vào điểm số; và sealed gateway cũng chỉ forward đúng một model.
- Danh sách tool bị loại (`web_search`, `web_fetch`…) chỉ áp cho agent cha, không áp cho agent con.

Runner giờ chép một bản "staged" của các agent: bỏ dòng `model:` để agent con dùng chung model đang benchmark, và lọc tool bị loại khỏi danh sách `tools:` của từng agent. Thêm vào đó là AGENTS.md v3.1 với một checklist "trước khi sửa dòng code đầu tiên", đi kèm một extension giữ lần edit đầu tiên lại cho tới khi agent đã đọc một skill hoặc giao việc cho subagent.

| | v2.1 | v3.1 | v3.2 |
| --- | ---: | ---: | ---: |
| Task đọc skill `dev-workflows` | 0/50 | 50/50 | 50/50 |
| Task đọc skill `subagents` | 0/50 | 27/50 | 34/50 |
| Số lần gọi subagent (toàn bộ là `reviewer`) | 0 | 13 | 10 |
| …trong đó timeout, không ra verdict | – | 4 | 5 |

Từ 0 lên 50/50 nghe như một chiến thắng. Nhưng nhìn dòng cuối: gần một nửa số lần gọi reviewer chết vì timeout trước khi kịp kết luận gì. Mình quay lại chuyện này ở phần 5.

# 3. Vì sao mỗi task chậm gấp đôi?

| Metric | v2.1 | v3.1 | v3.2 |
| --- | ---: | ---: | ---: |
| Tổng thời gian chạy agent | 425 phút | 858 phút | 883 phút |
| Trung vị mỗi task | 7.4 phút | 15.8 phút | 16.1 phút |
| Số task chạy quá 20 phút | 1 | 19 | 22 |
| Số task timeout | 1 | 10 | 6 |
| Chi phí agent | $1.99 | $2.44 | $2.30 |
| Chi phí trên mỗi task giải được | $0.044 | $0.057 | $0.055 |

Thời gian tăng gấp đôi trong khi số lượt gọi model gần như không đổi (2721 → 2824 → 2650). Vậy agent không làm *nhiều việc hơn* — mỗi việc tốn *nhiều thời gian hơn*. Mình tìm ra bốn nguyên nhân.

## 3.1 Provider chậm hơn gần một nửa (nguyên nhân lớn nhất)

Cùng một model id, nhưng tốc độ sinh token ở các bước đơn giản (`read` một file) đi từ **~50 token/s ở v2.1 xuống ~27–30 token/s** ở cả hai sealed run. Model còn nghĩ nhiều hơn: reasoning token tăng từ 0.99M lên 1.49M (v3.1) và 1.33M (v3.2), số lượt "nghĩ" dài hơn 4k token tăng gấp đôi.

Mình đã kiểm tra gateway: nó forward request nguyên vẹn, không đổi model, cache hit vẫn ~96%. Nên giải thích hợp lý nhất là OpenRouter định tuyến tới provider khác chậm hơn trong tuần đó. Điểm đáng chú ý là ở bài trước mình đã ghi "v1 ghim `fp4`, từ v2 bỏ ghim" như một biến chưa kiểm soát — tuần này nó cắn thật. Nếu không ghim provider, so sánh thời gian giữa các run gần như vô nghĩa.

## 3.2 Một tool âm thầm hỏng trong môi trường niêm phong

Harness của mình dùng [pi-lens](https://github.com/apmantza/pi-lens) cho LSP và lint. Mỗi container mới, pi-lens tự cài `pyright`, `ruff`… từ PyPI. Trong sealed mode PyPI bị chặn, nên nó **retry, retry, retry** — log proxy ghi **2870 request bị chặn trên 40/50 task** ở v3.1, luôn theo từng cụm 42 lần. Mỗi lần agent gọi `lens_diagnostics` mất khoảng 54 giây để rồi trả về "LSP chưa sẵn sàng".

Bản sửa: cài sẵn `node`, `pyright`, `ruff` vào volume toolchain lúc chuẩn bị (lúc đó còn network), và bật `PI_LENS_DISABLE_TOOL_INSTALL=1` trong container. Ở v3.2, số request bị chặn giảm từ 2870 xuống **293 trên 9 task** — phần còn lại là test linkcheck của Sphinx tự gọi `google.com`, `w3.org` (traffic hợp lệ của test) và vài lệnh `pip` của agent chạm vào `pypi.org` ở 5 task — trong đó có một lần `pip download` thật. Tất cả đều bị chặn.

> **Bài học thứ nhất** — Mỗi lần siết sandbox, có một tool nào đó giả định là có internet và sẽ hỏng *một cách im lặng*. Nó không làm fail task, nó chỉ làm mọi thứ chậm đi và để lại log trông như agent đang gian lận.

## 3.3 Runner tự bắn vào chân mình (hai lần)

Khi đọc 10 task timeout của v3.1, mình thấy **5/10 không phải timeout ở giai đoạn chính**. Agent đã xong ở phút 16–25, test thật fail, runner cho agent một lượt verification retry… nhưng lượt retry đó dùng chung đồng hồ 30 phút. Còn 5–14 phút để sửa, agent bị giết giữa chừng. Kèm theo là một lỗi đo đạc: `durationMs` được ghi *trước* giai đoạn retry, nên có task "timeout" với thời gian ghi nhận là 960 giây.

Lỗi thứ hai: nudge "đã dùng 50% thời gian" hoạt động bằng `session.abort()` — y như cái lỗi "nudge tới chết" ở bài trước, chỉ là kiểu khác. Mỗi lần nudge bắn ra, nó **giết luôn tool đang chạy** (đúng 29/29 lần ở v3.1): một lượt chạy test, một subagent đang review dở… agent phải làm lại từ đầu.

Bản sửa trong pi-bench `v1.1.0`:
- Verification retry có ngân sách riêng: phần còn lại của 30 phút, nhưng **tối thiểu 10 phút** (`--retry-timeout`). `durationMs` giờ tính cả retry, có thêm `retryDurationMs` và `retryTimedOut`.
- Nudge 50% được gửi bằng `session.steer()`: tin nhắn được xếp hàng và tới tay agent sau khi tool hiện tại chạy xong, không abort gì cả.

Số task timeout giảm từ 10 xuống 6. Nhưng tổng thời gian không giảm — một phần vì retry giờ được chạy lâu hơn thay vì bị cắt, phần lớn vì provider vẫn chậm.

## 3.4 Reviewer subagent đắt hơn mình nghĩ

13 lần gọi reviewer ở v3.1 tốn tổng cộng hơn 1 giờ, và 4 lần trong đó không trả về gì ngoài "Subagent timed out". Chi tiết ở phần 5.

# 4. Một bộ dò gian lận báo động trên 78% số task thì vô dụng

Sealed mode có thêm cờ `contaminationSuspected`. Ở v3.1, cờ này bật trên **39/50 task**. Nghe thì đáng sợ, nhưng khi đối chiếu thì chỉ có **2 task** agent thực sự cố tải code upstream. 37 task còn lại bị gắn cờ vì… pi-lens retry PyPI ở phần 3.2: bộ dò coi *mọi* request bị chặn tới `pypi.org` là dấu hiệu gian lận.

Mình sửa ba thứ:
- Request bị chặn tới package index (`pypi.org`, `pythonhosted.org`) **không còn tự động** là gian lận — `pip install`, chính `pip` kiểm tra version, hay tool installer đều gọi tới đó. Các host chứa code (GitHub, GitLab, readthedocs…) vẫn tính.
- Lệnh `pip download <package>` của agent vẫn bị bắt ở tầng lệnh như trước.
- Trước đây bộ dò chỉ đọc lệnh `bash` của agent cha. Lệnh của **subagent** (chạy ở process khác) và lệnh qua tool `run_test` thì lọt hết. Giờ runner đọc cả lịch sử tin nhắn của subagent khi nó trả kết quả về, và gắn nhãn nguồn (`via: subagent:reviewer`).

Ở v3.2, cờ bật trên **1/50 task** — và đó là một lần `pip download` thật (bị chặn).

> **Bài học thứ hai** — Công cụ đo cũng cần được kiểm. Một bộ dò báo động trên 39/50 task không phải đang bắt gian lận; nó đang đo một thứ khác (ở đây là một tool bị hỏng).

# 5. Hai bản sửa mình rất tự tin, nhưng không hoạt động

Phần này là lý do mình muốn viết bài, vì nó ngược với cảm giác lúc sửa.

## LSP vẫn không bao giờ sẵn sàng

Sau khi cài sẵn `pyright`, `ruff` và `node`, mình kiểm tra bằng tay trong đúng image của task, `--network none`, volume read-only: `pyright` chạy và ra diagnostic thật, `ruff` chạy, `pyright-langserver --stdio` trả lời handshake `initialize` của LSP. Mình khá chắc là xong.

Ở v3.2: **17/18 lần** agent gọi `lens_diagnostics` vẫn nhận về `no LSP client is currently ready; ready=0/5`. Tool có trên PATH, chạy được bằng tay, nhưng pi-lens trong một session thật thì không bao giờ báo nó sẵn sàng. Mình chưa biết nguyên nhân — nghi ngờ hàng đầu là pyright khởi tạo trên repo cỡ Django quá chậm khi chạy giả lập x86 trên máy Mac ARM, vượt thời gian chờ của pi-lens. Cái giá ít nhất đã giảm: không còn 54 giây retry mỗi lần gọi.

## Reviewer vẫn timeout

Phân tích bên trong các lần reviewer chết ở v3.1 cho thấy: một lượt "nghĩ" của nó mất **100–285 giây** (5–9k token reasoning trước một lệnh `grep` một dòng, vì nó thừa hưởng mức thinking `high`), trong khi agent cha tự chọn timeout chỉ 180–300 giây. Reviewer bị giết giữa lúc đang nghĩ, ngay trước khi kết luận.

Bản sửa trong pi-config `v3.2`: reviewer dùng `thinking: low`, timeout mặc định 10 phút, và một trường mới `minTimeoutMs: 420000` — agent cha xin timeout ngắn hơn 7 phút sẽ bị nâng lên 7 phút. Mình chạy lại đúng lần gọi reviewer đã timeout hai lần của `django-12039` (cùng task, cùng diff, cùng model, cùng timeout 240 giây): reviewer xong sau **211 giây** với `Merge verdict: OK`, lượt nghĩ dài nhất chỉ 1,737 token. Rất đẹp.

Ở v3.2:

- Floor hoạt động đúng: những lần agent cha xin 240 hay 300 giây đều được nâng lên đúng 420 giây.
- Nhưng **5/10 lần gọi vẫn timeout** — giờ là sau 7–10 phút thay vì 3–5 phút. Tệ hơn: mỗi lần chết giờ tốn nhiều thời gian hơn.
- `thinking: low` **không tạo ra khác biệt đo được** trong container: trung vị token mỗi lượt của reviewer đi từ 289 lên 343, p90 từ 1,944 lên 2,934, vẫn có lượt 9k token.
- Một reviewer chỉ chạy 2 lượt rất ngắn rồi im lặng tới hết 420 giây — một kiểu treo khác hẳn.

Lần chạy lại trên máy host là một mẫu duy nhất, và nó không tổng quát hoá.

> **Bài học thứ ba** — Một lần tái hiện thành công không phải là bằng chứng bản sửa hoạt động. Nó chỉ chứng minh bản sửa *có thể* hoạt động trong đúng điều kiện đó.

# Nên đọc những con số này thế nào?

| | v2.1 | v3.1 | v3.2 |
| --- | ---: | ---: | ---: |
| Pass (48 task hợp lệ) | 45 | 43 | 42 |
| Pass ngay lần đầu (không cần retry) | 41 | 35 | 36 |
| Task cần retry / được retry cứu | 7 / 4 | 11 / 8 | 10 / 6 |

- Ba run nằm trong khoảng **42–45/48**, và mọi chênh lệch giữa chúng đều trong vùng nhiễu của một lần chạy đơn.
- Pass ngay lần đầu giảm từ 41 xuống 35–36, và agent dựa vào retry nhiều hơn (cứu 6–8 task thay vì 4). Có thể là do niêm phong (không còn đường tắt), có thể do chạy chậm hơn và hay bị cắt giữa chừng, có thể chỉ là nhiễu — mình chưa tách được.
- Lưu ý từ bài trước vẫn còn nguyên: verification retry cho agent **xem output của chính bộ test ẩn dùng để chấm**. SWE-bench chuẩn không làm vậy. Nếu chỉ tính pass ngay lần đầu thì con số "sạch" nhất hiện tại là **35–36/48**.

# Kết luận

Ở bài trước mình nói benchmark cũng là software và nó rò rỉ như software. Bài này thêm một vế: **siết benchmark cũng là thay đổi môi trường, và mỗi thay đổi môi trường làm hỏng một thứ gì đó mình không nhìn thấy.** Niêm phong network làm hỏng tool LSP; tool LSP hỏng làm bộ dò gian lận báo động giả; một cơ chế nudge làm chết tool đang chạy; và một biến mình bỏ qua (provider) giải thích phần lớn chỗ chậm.

Điều mình hài lòng: con số 42–43/48 bây giờ đến từ một môi trường mà mình biết là không còn đường tắt nào mở, và mọi lần agent thử đi tắt đều có trong log.

# Việc tiếp theo

1. **Ghim provider trên OpenRouter**: gateway có thể chèn `provider` vào mỗi request. Không ghim thì so sánh thời gian giữa các run là vô nghĩa.
2. **Tìm nguyên nhân LSP không bao giờ sẵn sàng** trong session thật: đo thời gian khởi tạo pyright dưới giả lập x86, và thời gian chờ của pi-lens.
3. **Reviewer**: hoặc làm nó rẻ hơn hẳn (ít tool hơn, prompt hẹp hơn), hoặc bỏ khỏi luồng benchmark. Một subagent timeout một nửa số lần gọi đang tốn thời gian nhiều hơn giá trị nó mang lại.
4. **Chạy mỗi cấu hình 3 lần** — vẫn là món nợ từ bài trước, và giờ nó càng cần vì các chênh lệch đều nhỏ.
5. **Báo cáo pass ngay lần đầu làm con số chính**, và sửa nốt `summary.json` đếm trùng.

Code của lần cập nhật này: pi-bench [`v1.1.0`](https://github.com/hllj/pi-bench/tree/v1.1.0) và pi-config [`v3.2`](https://github.com/hllj/pi-config/tree/v3.2). AGENTS.md v3.1 mình để ở [gist này](https://gist.github.com/hllj/d716e5e0aa34d4971cef7fa459b2cffc).

> Lần này điểm giảm, nhưng mình tin nó hơn. Có lẽ đó cũng là một kiểu tiến bộ :)
