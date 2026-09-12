---
title: "Pi - cách mình setup extension và đánh giá agent harness bằng SWE-bench (70%)"
categories: blog
tags:
  - vietnamese
  - tutorial
  - pi
  - swe-bench
  - benchmark
toc: true
toc_label: "Table of Contents"
toc_icon: "cog"
toc_sticky: true
---

# Tại sao lại là Pi?

Đối với những lập trình viên, top 1 vẫn luôn là Claude Code; Harness của Claude Code rất phức tạp và đã tối ưu rất nhiều; nhưng việc mình sử dụng Pi giống như là một cách để mình tự học về cách tối ưu Harness cho riêng mình; cùng với việc kiểm soát được nhiều hơn.

Pi là một agent harness có một phong cách thiết kế rất riêng, tối giản và có thể tuỳ chỉnh theo ý của người dùng. Nó hỗ trợ để người dùng tạo ra các `extension`.

Thứ khiến mình rất thích của Pi là chúng ta có thể quản lý mọi thứ ở dạng extension, có life cycle cụ thể cho mỗi extension giống như Claude Code hook: "Mọi thứ đều được config as code".

> **TL;DR** — Toàn bộ setup Pi của mình là `config as code`: mọi extension được quản lý bằng git trong [pi-config](https://github.com/hllj/pi-config) và được check với `npm run check` trước khi đưa vào dùng. Để biết setup đó có tốt thật không, mình chạy nó trên benchmark thật [pi-bench](https://github.com/hllj/pi-bench) (SWE-bench Verified Mini, 50 task): kết quả **35/50 — 70%** bằng `deepseek/deepseek-v4-flash-0731` — model rẻ, nhanh nhất đạt được mức đó mà không tool-looping.

# Part 1: Extension setup của mình

Mình muốn vào thẳng thứ mình thích nhất ở Pi đó là [`extension`](https://pi.dev/docs/latest/extensions). Chúng ta có thể ship cho Pi những tuỳ chỉnh thông qua extension: một thư mục chứa những tools, commands, prompt, tinh chỉnh TUI (terminal user interface) widget.

Mình đưa những config của mình về extension thành một folder `pi-config` và symlink nó tới `~/.pi/agent/extensions`; và với mỗi thay đổi nó có thể versioning, check lại code với `npm run check` (lint, typecheck, tests) trước khi có thể đưa vào Pi.

Dưới đây là các extension trong setup của mình, được gom nhóm lại về chức năng và mô tả.

## Harness core

| Extension | Chức năng |
| --- | --- |
| `bash-tools` | context-economical tool: `file_sizes` (xác định tệp nào cần đọc kỹ và tệp nào chỉ nên lướt qua để tránh làm loãng ngữ cảnh), `run_test` (chạy test có mục tiêu kèm giới hạn thời gian và giai đoạn RED), `capture_output` (ghi dữ liệu đầu ra lớn vào đĩa thay vì làm tràn ngữ cảnh). Tất cả được xây dựng dựa trên bài học rằng các công cụ có cấu trúc và giới hạn phạm vi sẽ hiệu quả hơn so với việc dùng lệnh bash thuần túy. |
| `background-tasks` | Xử lý tác vụ chạy dài không gây chặn: `task_run`, `task_status`, `task_wait`, cùng với một widget giao diện văn bản (TUI) hiển thị các tác vụ đang chạy, đã hoàn tất hoặc đã hết thời gian chờ. |
| `monitor` | Theo dõi command log hoặc WebSocket stream và kết quả với `notify` / `log` / `interrupt` — xem tail logs, watch CI, live feeds |
| `subagent` | Delegate tới các agent chuyên biệt như (scout, planner, worker, reviewer) context nhỏ, cô lập; có các mode `parallel`/`chain`/`workflow`, JSON-Schema contracts, cross-agent message, lưu trữ agent run nếu cần phải chạy `pi --resume`. |
| `plan-mode` | Read-only mode: vô hiệu các write tools, danh sách các lệnh bash được cho phép, đánh số plan với `[DONE:n]` và theo dõi qua `/plan`. |
| `todo` | Các lệnh để ghi vào danh sách cần làm (`todo add/toggle/clear`) để các lần chạy nhiều bước có thể track lại công việc |
| `session-memory` | Một file lưu bộ nhớ làm việc mỗi session `CURRENT.md` — state, files, worklog, learnings — được nạp lại mỗi lần mình /resume (`/resume`). |
| `learning` | Lệnh để học được những kỹ năng từ các phiên chạy với lệnh (`/learn`). (nó vẫn đang trong quá trình cải tiến) |
| `verify-guard` | Nhắc nhở chỉnh sửa tập tin mà chưa xác thực bất cứ điều gì — "definition of done" kiểm tra. |
| `question` / `questionnaire` | Đặt câu hỏi có cấu trúc/chọn phương án vào đúng thời điểm. |
| `custom-compact` / `trigger-compact` | Kiểm soát việc nén ngữ cảnh (kích hoạt thủ công + tóm tắt tùy chỉnh). |
| `custom-footer`, `web-tools` | Tùy chỉnh phần footer giao diện + các công cụ web_search/web_fetch để lấy thông tin cập nhật, được xây dựng dựa trên Duckduckgo. |
| `skills/` | Những skills hiện có: `dev-workflows` (Những multi-agent preset: swat, bugfix, refactor, explore) và `subagents` (when/how to delegate). |

## Những package với extension khác

| package | Chức năng |
| --- | --- |
| `npm:pi-lens` | LSP diagnostics, ast-grep / tree-sitter structural rules, lint findings, and project-orientation (graph builds, `module_report`, `symbol_search`, blast-radius). Bộ công cụ để check error code giống như trong VSCode có LSP, báo cho Coding agent biết để chỉnh |

## Agents

Thư mục `agent/` bao gồm: `scout` (trinh sát/thu thập thông tin ở chế độ read-only), `planner` (chuyên lập kế hoạch), `worker` (triển khai theo phương pháp TDD), `reviewer` (rà soát với góc nhìn mới) và `general` (agent dự phòng). Thường chạy nó thông qua các quy trình phát triển (dev-workflow) được thiết lập sẵn: `swat`, `bugfix`, `refactor` và `explore`.

## Runtime config (`settings.json`)

```json
{
  "defaultProvider": "openrouter",
  "defaultModel": "deepseek/deepseek-v4-flash-0731",
  "defaultThinkingLevel": "high",
  "theme": "dark",
  "packages": ["npm:pi-lens"]
}
```

`defaultModel` là DeepSeek V4 Flash — chi phí thấp, tốc độ nhanh, chất lượng đủ tốt để bao quát nhiều khía cạnh; xem Phần 2 để hiểu lý do mình tin dùng nó. Toàn bộ extension và setting trong Pi đều nằm trong git [pi-config](https://github.com/hllj/pi-config).

# Part 2: Cách mình đánh giá agent harness của mình

Để đánh giá chất lượng của agent harness của mình, mình không chỉ thử và thấy nó tốt. Mình dùng một benchmark repo là [pi-bench](https://github.com/kyuz0/pi-bench): một repo benchmark lightweight và có thể tinh chỉnh để thử nghiệm pi-coding-agent. Nó chạy trên những task thật và kiểm tra nó với test suite; để trả lời một câu hỏi: "Liệu agent harness của mình có thể hoàn thành được công việc không ?". Mình tạo ra một phiên bản fork ở [hllj/pi-bench](https://github.com/hllj/pi-bench) nơi mình thử nghiệm và ghi lại các kiểm thử. Ở phần dưới là kết quả chạy từ bản fork của mình.

## Pi-bench thực sự chạy như thế nào ?

- Pi-bench hỗ trợ nhiều bộ benchmark; mình dùng bộ mặc định là SWE-bench Verified Mini - 50 task được verify (25 Django, 25 Sphinx) được chọn từ SWE-bench. Nó đủ nhỏ để mình chạy nhanh và đủ rộng để kiểm tra khả năng của harness trên khả năng thực tế (chỉnh sửa Python, chạy các edge cases, regression test, ...).
- Mỗi task đều chạy trong Docker container riêng biệt từ official SWE-bench Docker container: chỉnh sửa ở một Python version, các dependency có sẵn, và repo ở đúng commit dưới `/testbed` và không gặp vấn đề về environment.
- Trước khi mỗi agent bắt đầu, nó sẽ commit một clean `benchmark-baseline` snapshot để những file có sẵn trong image (ví dụ như `setup.py`/`tox.ini` noise) đó không tác động vào agent.
- Bật `pi-coding-agent` được setup sẵn như trong máy mình lên: lấy từ `~/.pi/agent` tất cả extensions, skills, prompt và `settings.json` được mount vào trong docker.
- Mình sẽ tắt `web_search` và `web_fetch` theo mặc định (`--exclude-tools`), để ngăn agent tự tìm kiếm những cách fix trên mạng thay vì tự tay làm nó. Mình đã gặp trường hợp này lúc chạy một vài task, agent thật sự đã search những thông tin đó và đã pass qua.
- Sau khi agent hoàn tất việc chỉnh sửa, hệ thống sẽ áp dụng **test patch** của SWE-bench và chạy các tests `FAIL_TO_PASS` bên trong container. Kết quả tests đóng vai trò là **đáp án chuẩn** (ground truth): nếu kiểm thử đạt thì `judgeScore = 1`, còn nếu không đạt thì `0`. Sau đó, một mô hình LLM đóng vai trò judge sẽ đọc phần thay đổi mã nguồn (diff) và giải thích lý do thành công hoặc thất bại — tuy nhiên, nó không thể thay đổi điểm số đã được quyết định bởi kết quả kiểm thử. Phán quyết và giải thích của judge được lưu trong `judgeScore` / `judgeRationale` (để mình có thể đối chiếu mức độ thống nhất giữa judge và kết quả kiểm thử theo thời gian), đồng thời hệ thống sẽ thử lại tối đa 3 lần nếu dữ liệu JSON do nó tạo ra không thể phân tích cú pháp.
- Mỗi tệp `results-<task>.json` ghi lại diff, `judgeScore` (điểm cuối cùng), `judgeRationale` (giải thích của judge) và kết quả test trực tiếp (`testExitCode`/`testOutput`, cùng `sweTestExitCode` cho các task chạy trong container). Trường `scoreSource` chỉ xuất hiện khi điểm bị rescore lại bởi container-test, với giá trị `container-test-rescore`.

## Mình đã chạy nó như thế nào

Smoke-test cho task đầu tiên để check thử xem nó có kết quả là `[INFO] Score: 1`, nghĩa là agent đã chạy, judge đã chạy và mọi thứ work:

```bash
bun run src/index.ts tasks/example-task.json \
  --provider openrouter --model deepseek/deepseek-v4-flash \
  --judge-model openrouter/deepseek/deepseek-v4-flash --timeout 4
```

Sau đó chạy full task với dataset SWE-Bench với lệnh sau, mình chạy trên máy Mac qua OpenRouter khoảng 13 phút cho mỗi task:

```bash
./run-swe-bench.sh tasks/verified-mini/ \
  --provider openrouter --model deepseek/deepseek-v4-flash-0731 \
  --judge-model google/gemini-3.1-pro-preview \
  --platform macos-openrouter --timeout 30
```

Những credential về authentication được tự động lưu trữ từ `pi auth login` được ghi ra trong file `~/.pi/agent/auth.json`, nó sẽ tự động fall back về env var ở `.env` được lưu trữ trong container. Kết quả sẽ nằm ở folder `benchmark_results/<platform>/<model>_results/` - mỗi `results-<id>.json` cho mỗi task; cộng thêm với `summary.json` (lưu tỷ lệ pass rate) và `run-meta.json` lưu metadata cho lần chạy (model, judge, timeout, excluded tools). Re-run sẽ skip qua những task đã hoàn thành; `--model-tag` sẽ tạo ra một lần chạy mới hoàn toàn so với cái đã được track.

`bun run scripts/generate-report.ts` biến mọi thứ thành một trang Dashboard HTML tĩnh từ `docs/data.json`, mình có thể serve nó lên để xem được kết quả và so sánh giữa các mô hình.

![Pi-bench dashboard — pass rate giữa các model](/images/pi-bench-dashboard.png)
<!-- TODO: tạo ảnh bằng: cd ~/Projects/pi-bench && bun run scripts/generate-report.ts && python3 -m http.server -d docs → mở http://localhost:8000 → chụp phần pass-rate chart → lưu vào images/pi-bench-dashboard.png -->

## Mình đã xem qua log và đưa ra kết luận gì?

Mình đã chạy thử Pi coding agent với config và thông số ở trên MacOs với OpenRouter với mô hình DeepSeek V4 Flash 0731 ở cuối tháng 8 mình có kết quả như sau:

| Metric | Value |
| --- | --- |
| Tasks | 50 (25 Django, 25 Sphinx) |
| Passed | **35/50 — 70%** (Django 18/25, Sphinx 17/25) |
| Avg duration, passed / failed | ~12 min / ~16 min |
| Longest task | `sphinx-8035` **125 min** (it did eventually pass) |

Sau khi xem lại log và sàng lọc ra (tất nhiên có sự trợ giúp của AI), có một vài thứ khá thú vị:

Sau khi xem lại log và sàng lọc ra (tất nhiên có sự trợ giúp của AI), có một vài thứ khá thú vị:

### 1. Pass rate — nơi thấy rõ năng lực model

Agent fail các task Django ở các ràng buộc / edge case (over-aggressive query batching, thường bỏ qua các check tính unique); Sphinx thì nằm ở các case exact byte frozen test và gặp các environment noise (`setup.py`, `tox.ini`). Những vấn đề này mình cũng chưa biết phương án để fix, có thể nằm ở năng lực của model DeepSeek.

### 2. Lỗi của chính bộ runner pi-bench

Có vài fail case thực ra do lỗi của chính bộ runner: 2 case do lỗi từ phần đánh giá `failToPass` khi chạy toàn bộ suite test. Mình đã cập nhật code `pi-bench` để ưu tiên ground-truth từ kết quả run test, thêm retry cho LLM judge khi scoring, cùng vài chỉnh sửa khác. Sau khi rescore lại bằng container-test, có 7 task được đánh giá lại và 4 trong số đó chuyển từ fail sang pass (đều nằm trong con số 35 cuối cùng).

### 3. LLM Judge vs. container-test không đồng nhất

Có những case judge cho rằng fix đã đúng nhưng test vẫn fail. Điển hình là một case mà judge đã bỏ lỡ cái bẫy logic phụ thuộc thời gian kinh điển (agent tính năm RFC-850 từ `utcnow()`, trong khi test hardcode năm 1971).

**Bài học rút ra là**: chỉ nên sử dụng 1 phương thức để đánh giá kết quả là test suite cuối cùng, LLM Judge chỉ được sử dụng để giải thích — và model để judge nên mạnh hơn và khác hẳn so với model chạy, tuỳ vào budget mình có.

### 4. Đọc transcript của những task chạy quá lâu

Agent cứ tìm fix commit ở trong tương lai ở trong git history ngay trong container (vì SWE-bench image có full repo history) và nó tiêu tốn 45+ phút backport những version khác nhau để thử các version; ngoài ra edit `setup.py` / `tox.ini` cũng làm vấn đề này thêm nặng và cứ tiếp tục vòng lặp. **Bài học:** đừng để agent cắm thử những fix trong tương lai; không bao giờ cho phép chỉnh sửa những dependency files.

### 5. Tool usage — bash áp đảo `run_test` ~10:1

Raw `bash` được sử dụng nhiều hơn hẳn so với `run_test` với tỉ lệ ~10:1. Mình cần chỉnh lại các tool trong harness để chúng được dùng đúng lúc hơn, ví dụ như `run_test` chạy nhiều hơn ở đầu và cuối để đánh giá, thay vì bash liên tục.

Đây cũng chính là lý do mình vẫn giữ `deepseek/deepseek-v4-flash-0731` làm mô hình mặc định từ Phần 1: đó là mô hình tốc độ cao rẻ nhất đạt **tỷ lệ 70%** trên tập dữ liệu con tương đối khó này mà không cần thực hiện tool-looping nào.

Vậy nên đây có thể là một cách để mình thử nghiệm một mô hình mới từ các LLM Provider, đấy là "liệu mô hình đủ tốt cho mình hay không ?" bằng một benchmark thật sự (và tốn một ít tiền), mà không bị ảnh hưởng bởi cảm tính.

## Vì sao benchmark là cần thiết ?

Nếu thiếu đi một thước đo chuẩn, việc lựa chọn mô hình thường chỉ dựa vào cảm tính ("cảm thấy ổn"). Với pi-bench, mình có được câu trả lời dựa trên dữ liệu và có thể tái lập cho các câu hỏi: _hệ thống của mình — cùng với các phần mở rộng, câu lệnh gợi ý (prompt) và thiết lập hiện tại — thực sự đang sử dụng mô hình nào ở mỗi bước, và liệu đó có còn là lựa chọn tối ưu xét về chi phí và độ trễ hiện nay hay không?_ Các nhà cung cấp liên tục tung ra mô hình mới; công cụ benchmark này giúp biến sự thay đổi liên tục đó thành một quyết định dựa trên dữ liệu thay vì chỉ dựa vào cảm tính. Và vì các container sử dụng trực tiếp tệp cấu hình `~/.pi/agent` thực tế của mình, nên điểm số phản ánh chính xác thiết lập thực tế mà mình đang dùng — chứ không phải một tác nhân (agent) lý tưởng trong môi trường thử nghiệm tách biệt vốn chưa từng tồn tại ngoài đời thực.

Điều này khép lại quy trình một cách nhất quán với tinh thần được nêu ở đầu bài viết: mọi thứ đều là "cấu hình dưới dạng mã nguồn" (config as code). Đó là các tệp tin thông thường nằm trong thư mục `~/.pi/agent`, được quản lý phiên bản bằng git và trải qua quy trình đánh giá mã nguồn như bất kỳ đoạn mã nào khác. Các phần mở rộng đảm nhận những công việc kỹ thuật nền tảng mang tính lặp lại — như quản lý ngữ cảnh (context management), tác vụ chạy ngầm (background tasks, subagents), bộ nhớ phiên làm việc (session memory) và quy trình xác thực — trong khi pi-bench xử lý yếu tố duy nhất thực sự biến đổi: đó là mô hình AI. Vẫn là hệ thống đó, vẫn bộ 50 tác vụ đó, chỉ cần một câu lệnh và kết quả cuối cùng là một con số cụ thể. Khi có mô hình mới hoặc thay đổi về giá, mình chỉ cần chạy lại benchmark thay vì phải dựa vào trí nhớ mơ hồ về cảm nhận trước đây.
