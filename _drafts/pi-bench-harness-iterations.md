---
title: "Từ 70% lên 90% trên SWE-bench Verified Mini — nhưng cái gì đã đã work, cái gì không"
categories: blog
classes: wide
tags:
  - vietnamese
  - pi
  - swe-bench
  - benchmark
  - harness
toc: false
toc_label: "Table of Contents"
toc_icon: "cog"
header:
  teaser: "/images/pi-bench-dashboard.png"
  overlay_image: "/images/pi-bench-dashboard.png"
  overlay_filter: 0.7
  overlay_color: "#005eff"
---

Ở [bài trước]({% post_url blog/2026-09-12-pi-coding-agent-setup %}), mình chạy Pi harness của mình với `deepseek/deepseek-v4-flash-0731` trên 50 task SWE-bench Verified Mini và được **35/50 — 70%**. Cuối bài mình hứa bài sau sẽ chỉ đổi một biến: harness.

Nhưng trước khi làm thí nghiệm đó, mình phải trả một món nợ. Đọc lại 15 task fail ở lần chạy đầu, mình thấy có khá nhiều lỗi nằm ở chính benchmark runner. Vậy nên mình sửa pi-bench, rồi chạy lại **hai lần nữa** với cùng model và cùng 50 task:

| Run | Ngày chạy | Pass rate |
| --- | --- | --- |
| v1 | 29–30/08 | 35/50 = 70.0% |
| v2 | 14/09 | 44/50 = 88.0% |
| v2.1 | 16–17/09 | 45/48 = 93.8% |

Nhìn qua thì đây là một đường đi lên rất đẹp. Nhưng khi đọc lại transcript của cả 150 lần chạy, mình thấy con số này kể một câu chuyện khác:

> **TL;DR** — Điểm tăng từ v1 lên v2 chủ yếu vì mình đổi *thứ được đo* (agent được nhìn output của test thật một lần), không phải vì agent giỏi hơn. Điểm tăng từ v2 lên v2.1 gần như chỉ là hiệu ứng của mẫu số. Và trong lúc sửa benchmark, mình phát hiện container vẫn có internet, nên agent có thể `pip download` bản Django mới hơn — bản đã chứa sẵn lời giải.

Toàn bộ phân tích chi tiết nằm ở [`debug/analysis_report_deepseek-v4-flash-v1-v2-v2.1.md`](https://github.com/hllj/pi-bench/blob/main/debug/analysis_report_deepseek-v4-flash-v1-v2-v2.1.md) trong repo pi-bench, kèm script `scripts/analyze-runs.py` để tái tạo mọi con số trong bài này.

# Giữa ba lần chạy, mình đã đổi gì?

Model, danh sách task và cách chấm bằng container test giữ nguyên. Phần thay đổi là harness:

| | Thay đổi chính |
| --- | --- |
| **v1** | Harness gốc. Chưa có retry, chưa có nudge. Có một task được ghi nhận tới 125 phút. |
| **v2** | Thêm **verification retry**: nếu test thật fail, agent được một lượt sửa nữa và được đưa output `FAIL_TO_PASS` thật. Thêm nudge khi agent sa đà vào git archaeology, judge chắc chắn hơn, sửa môi trường container (Node 22, ripgrep), và timeout 30 phút. |
| **v2.1** | Kiểm tra dữ liệu `FAIL_TO_PASS` khi import và loại task hỏng khỏi mẫu số (`harness-error`), gọi test bằng `execFile` thay vì shell, chặn sửa file config, **scrub git history** (chỉ còn một commit baseline), và nudge khi đã dùng 50% time budget. |

Mỗi run chỉ chạy một lần (`pass@1`). Mình sẽ quay lại hệ quả của điều này ở phần cuối.

# Kết quả nhìn từ ngoài

| Metric | v1 | v2 | v2.1 |
| --- | ---: | ---: | ---: |
| Pass rate | 35/50 = 70.0% | 44/50 = 88.0% | 45/48 = 93.8% |
| Cùng 48 task (bỏ 2 task dữ liệu hỏng) | 72.9% | 91.7% | 93.8% |
| Tổng thời gian chạy agent | 652 phút | 533 phút | 425 phút |
| Số task chạy quá 20 phút | 8 | 6 | 1 |
| Chi phí agent | $2.35 | $2.20 | $1.99 |
| Chi phí trên mỗi task giải được | $0.067 | $0.050 | $0.044 |

Từ v1 sang v2 có 11 task chuyển từ fail sang pass và 2 task chuyển ngược lại (kiểm định McNemar exact p = 0.022). Đây là bước nhảy thực sự, không phải nhiễu. Câu hỏi là nó đến từ đâu.

# 1. Phần lớn bước nhảy từ v1 lên v2 là do mình đo thứ khác

Verification retry chỉ chạy khi lần test thật đầu tiên fail. Vì vậy nếu một task có `verificationRetries = 1` và cuối cùng pass, đó là bằng chứng trực tiếp rằng retry đã cứu task đó.

| | v1 | v2 | v2.1 |
| --- | ---: | ---: | ---: |
| Task cần dùng retry | không có | 9 | 7 |
| Task được retry cứu | không có | **7** | **4** |
| Pass ngay lần đầu (không cần retry), trên 50 task | 35 (70%) | 37 (74%) | 41 (82%) |

Nếu bỏ retry đi, v2 chỉ đạt 37/50 = 74%, hơn v1 đúng 4 điểm phần trăm. Khoảng 14 điểm còn lại là **vòng phản hồi**, không phải lần thử đầu tiên tốt hơn.

Điều này không có nghĩa retry là xấu. Nó là một tính năng harness hợp lý, và trong thực tế agent luôn có thể chạy test. Nhưng nó thay đổi ý nghĩa của con số: v2 và v2.1 đo "agent cộng với một vòng phản hồi từ test chấp nhận", không còn là `pass@1` thuần như v1. Nếu mình đặt 88% cạnh 70% mà không nói rõ điều đó thì đang so hai thứ khác nhau.

Bài học đầu tiên: **mỗi khi harness thay đổi cách agent nhận phản hồi, phải báo cáo hai cột riêng: pass ngay lần đầu và pass sau retry.** Hiện tại pi-bench chưa lưu kết quả test trước retry, nên mình phải suy ra "lần đầu" từ cờ `verificationRetries` và điểm cuối. Đây là một việc cần sửa.

# 2. Từ v2 lên v2.1: chủ yếu là mẫu số và nhiễu

Số task pass chỉ đi từ 44 lên 45. Phần còn lại của bước nhảy 88.0% → 93.8% đến từ việc hai task có dữ liệu hỏng bị loại khỏi mẫu số:

- `django__django-12209`: trường `FAIL_TO_PASS` chứa một docstring thay vì tên test, nên runner chạy cả test suite của Django rồi hết timeout.
- `sphinx-doc__sphinx-8265`: node id của pytest bị cắt cụt (`test_unparse[(1,`), nên test không bao giờ chạy.

Hai task này không thể thắng, ở cả v1 lẫn v2, nhưng lại bị tính là fail. Loại chúng ra là đúng. Nhưng nó có nghĩa là 70% ở v1 thực ra là 35/48 = 72.9% nếu so cùng mẫu.

Còn chuyện các task còn lại thì sao? Giữa v2 và v2.1 có **10 trên 50 task đổi trạng thái pass lần đầu** (mất 3, được 7), trong khi tổng ròng chỉ tăng 4. Model giống nhau, prompt gần như giống nhau. Vậy độ nhiễu của một lần chạy đơn lẻ vào cỡ vài task. Chênh lệch 44 so với 45 không nói lên điều gì.

Vậy v2.1 tốt hơn ở điểm nào? Ở tốc độ và độ bền:

- Tổng thời gian giảm 20% so với v2 và 35% so với v1.
- Số task chạy quá 20 phút giảm 8 → 6 → 1.
- Không còn nudge git archaeology nào (22 lần ở v2), không còn diff rỗng.
- `sphinx-9320`, task mất 45 phút và không sửa một dòng source nào ở v1, chỉ còn 4 phút.

Nguyên nhân khả dĩ nhất là git scrub và time-budget nudge. Với một lần chạy đơn, mình không tách được phần đóng góp của từng thứ.

# 3. Scrub git history xong, container vẫn còn internet

Đây là phát hiện mình không ngờ tới. Ở bài trước mình viết "tắt `web_search` và `web_fetch`" trong bảng benchmark contract, và đề xuất chặn `git log` để agent không thấy commit tương lai. Ở v2.1 mình đã làm phần thứ hai: mỗi container chỉ còn một commit `benchmark-baseline`, mọi tag và ref khác đều bị xoá.

Nhưng khi đọc lại lệnh `bash` của agent, mình thấy nó làm thế này:

```bash
pip download django==3.2.25 --no-deps -d /tmp/djdl
```

Container có internet, `pip` chạy bình thường. Agent tải một bản Django **mới hơn** bản đang sửa. Bản đó đã chứa sẵn fix.

Một ví dụ cụ thể, task `django__django-11815` ở v2. Agent tải wheel `Django-3.2.25`, giải nén `serializer.py`, in ra class `EnumSerializer`:

```python
'%s.%s[%r]' % (module, enum_class.__qualname__, self.value.name)
```

Diff cuối cùng agent nộp gần như y hệt (chỉ khác `__name__` thay cho `__qualname__`):

```python
'%s.%s[%r]' % (module, enum_class.__name__, self.value.name)
```

Tương tự, ở v2.1 task `sphinx-10435` đọc trực tiếp `latex.py`, test và `CHANGES` của Sphinx `v5.0.1` qua `raw.githubusercontent.com`.

Số liệu mình đếm được (chỉ tính những lần tool result chứng minh việc tải thành công, nên đây là **cận dưới**):

| | v1 | v2 | v2.1 |
| --- | ---: | ---: | ---: |
| Task có tải thành công code upstream | ≥ 10 / 50 | ≥ 10 / 50 | ≥ 9 / 50 |
| Số lệnh `pip download` | 18 | 25 | 35 |

Vài điểm cần nói rõ, để không kết luận quá tay:

- Việc này xảy ra ở **cả ba run**, kể cả v1, và tỷ lệ gần như không đổi. Vì vậy nó không giải thích khác biệt giữa các run. Nó làm cho **mọi con số tuyệt đối** đều bị thổi phồng một lượng chưa biết.
- Agent có thể tải khi task khó, nên pass rate của nhóm task "có tải" không nói lên quan hệ nhân quả. Mình cũng chưa kiểm từng trường hợp để biết agent tận dụng code tải về đến đâu.
- `web_search` và `web_fetch` đã tắt thật, nhưng `bash` cộng với `pip`, `curl`, `urllib` đi vòng qua hoàn toàn.

Bài học thứ hai: **khi chặn một đường rò rỉ, hãy tự hỏi agent còn đường nào khác để đi tới cùng đích.** Scrub git history giải quyết đúng một trong hai đường. Cách xử lý đúng là chặn network egress của container, chỉ cho phép host của LLM API, rồi chạy lại những task đã tải code upstream để đo mức độ thổi phồng.

# 4. Bốn lỗi khác của chính runner

Khi kiểm từng task fail còn lại, mình tìm thêm bốn thứ nữa nằm ở runner hoặc dữ liệu, không phải ở model.

## Agent bị "nudge" tới chết

Nudge git archaeology hoạt động bằng cách gọi `session.abort()` rồi gửi lại một prompt cảnh báo. Khi hết ngân sách nudge (2 lần), code in ra "letting normal flow continue" rồi `break` khỏi vòng lặp. Nhưng session vừa bị abort, nên không còn gì tiếp tục: run kết thúc với bất cứ diff nào đang có.

Ở v2, `sphinx-10323` và `sphinx-9229` bị đúng kiểu này: nhận đủ hai cảnh báo, quay lại `git show` lần thứ ba rồi bị abort, kết thúc với **diff rỗng**. `sphinx-10323` pass ở v1 và v2.1, nên đây là điểm mất oan. v2.1 không dính chỉ vì scrub đã loại nguyên nhân kích hoạt. Lỗi vẫn còn nguyên trong code.

## Test fixture của agent xung đột với test patch chính thức

Task `sphinx-11510` fail ở cả v2 và v2.1 dù judge đọc diff và kết luận code fix "khớp chính xác với lời giải chuẩn". Nguyên nhân là chuỗi lệnh này:

1. Runner chạy `git add .` để lấy diff, việc này stage luôn các file test mới mà agent tạo.
2. Runner `git checkout HEAD -- tests/` và `git clean -fd tests/` để trả test về trạng thái sạch. Cả hai lệnh đều không xoá được file đã nằm trong index nhưng chưa có trong HEAD.
3. `git apply` test patch chính thức thất bại vì file đã tồn tại, runner rơi xuống `git apply --3way`, và kết quả là xung đột add/add: file fixture chứa `<<<<<<< ours`.
4. pytest chết với `SyntaxError` ngay khi setup fixture.

Mình tái hiện đúng chuỗi này trong một repo git nhỏ, và xác nhận rằng chỉ cần `git reset -q HEAD -- tests/` trước `git checkout` là test patch áp dụng sạch.

## Một task có khả năng cao là dữ liệu hỏng

`sphinx-9229` fail y hệt ở cả ba run, với lỗi `No module named 'target'`. Judge ở v2.1 đọc diff và thấy nó "gần như giống hệt" lời giải chuẩn. Test patch trong dataset thêm hàm `test_class_alias_having_doccomment(app)` mà không có marker `@pytest.mark.sphinx(..., testroot='ext-autodoc')`, nên test chạy với testroot mặc định. Đây rất có thể là entry hỏng thứ ba, nhưng mình chưa đối chiếu với SWE-bench gốc nên chưa kết luận chắc.

## Các con số báo cáo cũng sai

- `summary.json` ở v2 và v2.1 liệt kê mỗi task **hai lần**, vì script tổng hợp glob cả `results-<task>.json` lẫn `results-<task>-attempt1.json`. Kết quả là `totalTasks: 100` cho 50 task. Tỷ lệ pass vẫn đúng, còn số đếm và tổng thời gian thì nhân đôi.
- `durationMs` được chốt **trước** giai đoạn verification retry, nên task nào phải retry đều bị ghi ngắn hơn thực tế. Tổng thời gian ghi nhận của v2 là 474 phút, trong khi tính từ transcript là 533 phút. Mình dùng timestamp trong transcript cho các con số ở bài này.

# 5. LLM judge lần này lại có ích

Ở bài trước mình rút ra "test quyết định score, judge chỉ giải thích". Điều đó vẫn đúng. Nhưng lần này mình thấy một công dụng mới cho judge.

Ở v2.1, trong 48 task được chấm, chỉ có **đúng hai task** mà judge và container test bất đồng: `sphinx-11510` và `sphinx-9229`, cả hai đều judge = đúng, test = sai. Đó chính là hai task mình nghi có lỗi ở runner hoặc dữ liệu.

Vậy quy tắc "judge nói đúng nhưng test nói sai" là một cảnh báo rẻ để phân loại nhanh failure sau mỗi lần chạy: nó chỉ ra đúng chỗ cần đọc transcript. Mình không dùng judge để đổi điểm. Mình dùng nó như một bộ dò lỗi cho benchmark.

# Nên đọc những con số này thế nào?

Nếu phải tóm gọn thành vài câu mình sẽ dám nói:

- Với retry và các sửa lỗi runner, cấu hình hiện tại giải được khoảng **44–45 trên 48 task hợp lệ** ở lần chạy đơn, đã bao gồm việc agent có thể tải code upstream.
- **Pass ngay lần đầu là khoảng 74–82% (trên 50 task)**, và khoảng cách giữa hai con số này nằm trong vùng nhiễu.
- Chênh lệch 1–3 task giữa hai lần chạy không thể coi là cải thiện.
- Khoảng 10 task trong 50 là loại "lúc pass lúc fail" khi chạy lại, nên mình cần nhiều lần chạy hơn, không chỉ một.

Nếu `sphinx-11510` được sửa thì v2.1 có thể lên 46/48, và nếu `sphinx-9229` đúng là dữ liệu hỏng thì 47/48. Đó là cận trên cần xác nhận bằng cách chạy lại sau khi sửa, không phải kết quả đã có.

# Việc tiếp theo

Mình sắp xếp lại thứ tự so với những gì hứa ở bài trước. Thí nghiệm "stock Pi so với Pi cộng custom harness" vẫn là mục tiêu, nhưng nó chưa nên chạy trên một benchmark còn rò rỉ. Danh sách việc phải làm trước:

1. **Chặn network egress** của container, chỉ để lại host của LLM API, và chạy lại các task từng tải code upstream để đo độ thổi phồng.
2. **Sửa `revertAgentTestModifications`** để unstage file trước khi checkout (đã có cách sửa được xác nhận).
3. **Sửa nhánh "hết ngân sách nudge"** để agent vẫn còn một lượt thay vì bị abort.
4. **Lưu kết quả test trước retry** và báo cáo pass ngay lần đầu tách khỏi pass sau retry.
5. **Chạy thử patch chuẩn** của từng task trong container ngay lúc import, nếu `FAIL_TO_PASS` không pass với patch chuẩn thì loại task. Cách này sẽ bắt được cả 12209, 8265 và có thể cả 9229, thay vì chỉ kiểm hình dạng chuỗi.
6. **Sửa `summary.json`** để không đếm file `-attempt` hai lần, và ghi thời gian bao gồm cả giai đoạn retry.
7. **Chạy mỗi cấu hình ít nhất 3 lần**, hoặc tối thiểu chạy lại nhóm task không ổn định.
8. **Ghi lại provider và quantization** của mỗi request. Ở v1 mình ghim `fp4`, còn từ v2 mình bỏ ghim, nên hai run đầu và cuối có thể chạy trên endpoint khác nhau mà artifact không cho biết.

# Kết luận

Ở bài trước mình nói harness cũng là software. Sau hai lần chạy lại, mình muốn thêm một vế: **benchmark cũng là software, và nó rò rỉ theo đúng những cách mà software hay rò rỉ.**

Thứ mình học được không phải "model đạt 93.8%". Mà là:

1. Khi mình đổi cách agent nhận phản hồi, con số thay đổi ý nghĩa, dù nó trông như một đường đi lên.
2. Một lần chạy đơn không đủ để khẳng định chênh lệch vài task.
3. Chặn một đường rò rỉ không có nghĩa là đã chặn hết. Agent luôn tìm được đường còn lại.
4. Cách nhanh nhất để tìm lỗi của benchmark là đọc kỹ những task mà judge và test bất đồng.

Sau khi sửa xong danh sách ở trên, mình mới thấy đủ tự tin để làm thí nghiệm đã hứa: **cùng model, cùng task, chỉ đổi harness**.
