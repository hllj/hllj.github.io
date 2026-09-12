---
title: "Pi coding agent của mình đạt 35/50 SWE-bench Verified Mini — nhưng 15 task fail mới là phần thú vị"
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

Mình đã xây một Pi coding-agent harness gồm custom tools, subagents, session memory và các bước kiểm tra trước khi agent kết thúc công việc. Setup này dùng hằng ngày khá ổn, nhưng “cảm thấy ổn” không trả lời được câu hỏi quan trọng nhất:

> **Những extension mình thêm vào có thực sự giúp agent sửa code tốt hơn không?**

Để có một mốc ban đầu, mình mang nguyên config đang dùng chạy với [pi-bench](https://github.com/hllj/pi-bench) trên 50 task thuộc SWE-bench Verified Mini. Với `deepseek/deepseek-v4-flash-0731`, kết quả cuối cùng là **35/50 task pass — 70%**.

Con số đó khá tốt đối với một setup cá nhân. Tuy nhiên, phần có ích nhất của lần benchmark này không nằm ở 35 task đã pass. Nó nằm ở 15 task còn lại: agent bỏ sót edge case, tự tìm implementation trong git history, lặp lại ở các file dependency, dùng `bash` nhiều hơn hẳn tool test có cấu trúc, và đôi khi LLM judge nói đúng trong khi test lại nói sai.

Những lỗi đó khiến mình thay đổi cách nhìn về coding agent. Model chỉ là một phần của hệ thống. Harness cũng là software, nên nó cần được version-control, kiểm tra, benchmark và cải tiến dựa trên failure như mọi software khác.

> **TL;DR** — Toàn bộ setup Pi của mình được quản lý theo hướng `config as code` trong [pi-config](https://github.com/hllj/pi-config). Mình benchmark chính setup đó bằng pi-bench và đạt **35/50 trên SWE-bench Verified Mini**. Đây là kết quả của một benchmark nhanh trên subset 50 task, không phải 70% trên official SWE-bench Verified leaderboard.

# Trước hết: 35/50 thực sự có nghĩa là gì?

[SWE-bench Verified chính thức](https://www.swebench.com/SWE-bench/faq/) gồm 500 task đã được kiểm tra lại về khả năng giải quyết. Bộ `verified-mini` trong pi-bench chỉ lấy 50 task, gồm 25 task Django và 25 task Sphinx, để có thể lặp thử nghiệm nhanh hơn.

Ngoài khác biệt về số lượng task, cách chấm trong phiên bản pi-bench mình dùng tập trung vào các test `FAIL_TO_PASS`: những test vốn fail ở baseline phải pass sau khi áp dụng patch của agent. [Official SWE-bench còn xét cả `PASS_TO_PASS`](https://github.com/SWE-bench/SWE-bench/blob/main/swebench/harness/grading.py), tức là những test vốn đang pass phải tiếp tục pass để patch được tính là resolved hoàn toàn.

Vì vậy, kết quả trong bài nên được hiểu chính xác là:

> **35/50 task pass theo cơ chế đánh giá của pi-bench trên SWE-bench Verified Mini. Kết quả này hữu ích để so sánh các phiên bản model và harness trong cùng một setup, nhưng không thể so sánh trực tiếp với official SWE-bench Verified leaderboard.**

Mình vẫn thấy mốc này có giá trị. Mục tiêu của mình không phải tạo ra một leaderboard mới, mà là có một thước đo đủ ổn định để trả lời: với cùng task, cùng môi trường và cùng cách chấm, thay đổi model hoặc harness có làm kết quả tốt hơn hay không?

# Tại sao mình chọn Pi?

Mình không chọn Pi vì muốn tạo thêm một cuộc so sánh “tool nào đứng top 1”. Điều mình thích ở Pi là phần core nhỏ và khả năng tuỳ chỉnh sâu bằng [`extension`](https://pi.dev/docs/latest/extensions). Tool, command, prompt, event hook và TUI widget đều có thể được đưa vào code thay vì nằm rải rác trong một loạt thiết lập khó theo dõi.

Điều đó phù hợp với cách mình muốn xây coding agent:

- mỗi thay đổi đều nằm trong git;
- có thể lint, typecheck và test trước khi dùng;
- có thể quay lại phiên bản cũ khi một extension gây lỗi;
- có thể chạy benchmark để xem thay đổi đó thực sự giúp ích hay chỉ làm hệ thống phức tạp hơn.

Mình gom toàn bộ config vào repo [`pi-config`](https://github.com/hllj/pi-config), sau đó symlink extension tới `~/.pi/agent/extensions`. Mỗi thay đổi được kiểm tra bằng `npm run check` trước khi đưa vào workflow hằng ngày.

Theo cách này, harness không còn là một nhóm prompt và script mình nhớ mang máng đã chỉnh ở đâu. Nó trở thành một codebase có version, có test và có lịch sử thay đổi.

# Harness của mình gồm những gì?

Danh sách extension đầy đủ khá dài, nên cách dễ hiểu hơn là nhìn nó theo năm layer.

| Layer | Extension chính | Vai trò |
| --- | --- | --- |
| Context | `session-memory`, `custom-compact`, `trigger-compact`, `file_sizes` | Giữ trạng thái qua nhiều bước, kiểm soát compact và tránh đọc quá nhiều nội dung không cần thiết |
| Execution | `bash-tools`, `background-tasks`, `monitor` | Chạy lệnh, test và tác vụ dài với timeout, log và output được kiểm soát |
| Workflow | `plan-mode`, `todo`, `subagent`, `skills/` | Chia công việc thành plan, theo dõi tiến độ và giao phần việc cho agent chuyên biệt |
| Verification | `run_test`, `verify-guard`, `pi-lens` | Khuyến khích test có mục tiêu, kiểm tra LSP/lint và ngăn agent kết thúc khi chưa xác thực thay đổi |
| Interaction | `question`, `questionnaire`, `custom-footer` | Hỏi lại theo cấu trúc và hiển thị trạng thái cần thiết trong TUI |

Ba nhóm có ảnh hưởng trực tiếp nhất tới cách agent làm việc là execution, workflow và verification.

## Execution: giảm output thừa và quản lý task chạy lâu

`bash-tools` bổ sung một số tool có phạm vi rõ hơn so với `bash` thuần:

- `file_sizes` giúp agent quyết định file nào cần đọc kỹ, file nào chỉ cần lướt qua;
- `run_test` chạy test có mục tiêu, có timeout và hỗ trợ giai đoạn RED;
- `capture_output` ghi output lớn xuống đĩa để không làm tràn context.

`background-tasks` và `monitor` xử lý những lệnh chạy lâu mà không chặn toàn bộ session. Agent có thể chạy task, xem trạng thái, tail log hoặc chờ kết quả khi cần.

## Workflow: plan, todo và subagent

`plan-mode` đưa agent vào chế độ read-only khi cần khảo sát và lập kế hoạch. `todo` giữ lại danh sách việc phải làm trong những task nhiều bước. `subagent` cho phép giao việc cho các agent có context nhỏ và vai trò riêng như `scout`, `planner`, `worker` và `reviewer`.

Mình cũng có một số workflow dựng sẵn như `swat`, `bugfix`, `refactor` và `explore`. Ý tưởng ở đây không phải lúc nào cũng gọi nhiều agent, mà là dùng đúng mức độ phối hợp cho từng loại task.

## Verification: agent chỉ được “done” sau khi đã kiểm tra

`verify-guard` nhắc agent khi nó đã chỉnh file nhưng chưa chạy bất kỳ bước xác thực nào. `pi-lens` bổ sung LSP diagnostics, lint findings, structural search và một số thông tin về dependency hoặc blast radius.

Mục tiêu của layer này rất đơn giản: một patch nhìn hợp lý chưa đủ. Agent cần chứng minh nó hoạt động bằng test hoặc bằng tín hiệu kiểm tra phù hợp với project.

## Runtime config

Config mặc định lúc mình thực hiện benchmark:

```json
{
  "defaultProvider": "openrouter",
  "defaultModel": "deepseek/deepseek-v4-flash-0731",
  "defaultThinkingLevel": "high",
  "theme": "dark",
  "packages": ["npm:pi-lens"]
}
```

Mình chọn DeepSeek V4 Flash vì nó cho cảm giác cân bằng khá tốt giữa tốc độ, chi phí và chất lượng trong workflow hiện tại. Tuy nhiên, lần chạy trong bài mới chỉ thiết lập một baseline cho model này; nó chưa đủ để kết luận đây là model rẻ nhất hoặc nhanh nhất so với các lựa chọn khác.

# Thiết kế benchmark

Mình dùng [pi-bench](https://github.com/kyuz0/pi-bench), một benchmark runner gọn cho `pi-coding-agent`, rồi phát triển thêm trong fork [hllj/pi-bench](https://github.com/hllj/pi-bench). Runner đưa agent vào task thật, thu patch, chạy test và lưu lại transcript cùng metadata để mình có thể xem lại từng failure.

Đây là “benchmark contract” của lần chạy được nói tới trong bài:

| Thành phần | Thiết lập |
| --- | --- |
| Agent | Pi với config thực tế trong `~/.pi/agent` |
| Model | `deepseek/deepseek-v4-flash-0731` qua OpenRouter |
| Thinking level | `high` |
| Dataset | pi-bench SWE-bench Verified Mini |
| Tasks | 50: 25 Django, 25 Sphinx |
| Attempts | 1 lần cho mỗi task (`pass@1`) |
| Internet tools | Tắt `web_search` và `web_fetch` |
| Timeout | 30 phút cho mỗi task |
| Environment | Container riêng cho từng SWE-bench task |
| Scoring | Container test, tập trung vào `FAIL_TO_PASS` |
| LLM judge | Chỉ giải thích kết quả, không được ghi đè test score |
| Thời điểm chạy | Cuối tháng 8/2026 |

## Mỗi task được chạy như thế nào?

Quy trình của một task gồm các bước sau:

1. Pi-bench mở container tương ứng, với dependency và repository ở đúng commit trong `/testbed`.
2. Runner tạo một baseline sạch để các thay đổi vốn đã có trong image không bị nhầm thành thay đổi của agent.
3. Config thực tế từ `~/.pi/agent` được mount vào container, bao gồm extension, skill, prompt và `settings.json`.
4. Agent đọc issue, sửa code và chạy những tool nó cho là cần thiết. `web_search` và `web_fetch` bị tắt để hạn chế việc tìm trực tiếp lời giải trên mạng.
5. Khi agent kết thúc, runner thu `git diff`, áp dụng test patch và chạy các test `FAIL_TO_PASS`.
6. Kết quả container test quyết định task pass hay fail. LLM judge đọc diff và test output để viết phần giải thích, nhưng không thay đổi score.
7. Diff, test output, score, rationale và metadata được ghi vào file JSON để phục vụ việc kiểm tra lại.

Việc lưu cả test output lẫn giải thích của judge rất hữu ích. Nếu hai nguồn không thống nhất, mình có thể phát hiện lỗi nằm ở patch, judge hay chính runner.

## Cách mình chạy

Đầu tiên, mình smoke-test một task để kiểm tra toàn bộ pipeline từ agent đến judge:

```bash
bun run src/index.ts tasks/example-task.json \
  --provider openrouter --model deepseek/deepseek-v4-flash \
  --judge-model openrouter/deepseek/deepseek-v4-flash --timeout 4
```

Sau đó mình chạy toàn bộ Verified Mini trên macOS qua OpenRouter:

```bash
./run-swe-bench.sh tasks/verified-mini/ \
  --provider openrouter --model deepseek/deepseek-v4-flash-0731 \
  --judge-model google/gemini-3.1-pro-preview \
  --platform macos-openrouter --timeout 30
```

Thông tin xác thực từ `pi auth login` nằm trong `~/.pi/agent/auth.json`; runner có thể fallback sang biến môi trường trong `.env` khi chạy container. Kết quả được lưu theo từng platform và model trong `benchmark_results/`. Mỗi task có một file `results-<id>.json`, còn `summary.json` lưu kết quả tổng hợp và `run-meta.json` lưu model, judge, timeout cùng các tool bị loại trừ.

Khi chạy lại, runner bỏ qua task đã hoàn tất. Nếu muốn tạo một run độc lập, mình dùng `--model-tag`. Script sau tổng hợp các run thành dashboard HTML tĩnh:

```bash
bun run scripts/generate-report.ts
python3 -m http.server 8082 -d docs/
```

![Pi-bench dashboard — pass rate giữa các model](/images/pi-bench-dashboard.png)
<!-- TODO: tạo ảnh từ dashboard thật và thay đúng đường dẫn trước khi publish. -->

# Kết quả: 35 pass, 15 fail

| Metric | Kết quả |
| --- | ---: |
| Tổng số task | 50 |
| Passed | **35/50 — 70%** |
| Django | **18/25** |
| Sphinx | **17/25** |
| Thời gian trung bình của task pass | ~12 phút |
| Thời gian trung bình của task fail | ~16 phút |
| Task lâu nhất | `sphinx-8035` — **125 phút**, cuối cùng pass |

`--timeout 30` là timeout mình truyền cho agent, trong khi 125 phút là thời gian tổng được ghi lại cho task. Khoảng chênh lệch này cho thấy timeout hiện chưa bao trùm toàn bộ vòng đời chạy test và đánh giá; đây cũng là một điểm runner cần ghi rõ hoặc siết lại.

Nếu chỉ nhìn vào pass rate, mình có thể dừng ở kết luận rằng model và harness hoạt động khá ổn. Nhưng khi đọc lại transcript, mình nhận ra score chỉ nói được “bao nhiêu task pass”. Nó không giải thích “vì sao task fail”, và càng không cho biết nên sửa model, harness hay runner.

Đó mới là phần đáng quan tâm nhất.

# Năm điều mình học được từ những task fail

## 1. Model thường fail ở constraint nhỏ, không phải ở ý tưởng lớn

Trong nhóm Django, agent thường tìm được khu vực code cần sửa nhưng bỏ sót constraint hoặc edge case: batching quá mạnh, xử lý chưa đủ chặt, hoặc quên bảo toàn điều kiện unique. Với Sphinx, một số task nhạy với exact byte output hoặc bị nhiễu bởi các file như `setup.py` và `tox.ini`.

Điều này cho thấy failure không phải lúc nào cũng đến từ việc model “không hiểu issue”. Có trường hợp nó hiểu hướng sửa chính nhưng thiếu một bước kiểm tra nhỏ để patch trở nên đúng hoàn toàn.

Phần này hiện vẫn là giới hạn của model lẫn workflow kiểm tra. Muốn biết harness có giúp giảm loại lỗi này hay không, mình cần một thí nghiệm đối chứng thay vì chỉ đọc cảm giác từ transcript.

## 2. Benchmark runner cũng là software và cũng có bug

Một số task ban đầu bị chấm fail không phải vì patch sai, mà vì lỗi trong phần runner khi xử lý `FAIL_TO_PASS` và full test suite. Mình sửa pi-bench để ưu tiên ground truth từ container test, bổ sung retry khi judge trả JSON không hợp lệ và lưu rõ nguồn của score.

Sau khi rescore bằng container test, 7 task được đánh giá lại và 4 task chuyển từ fail sang pass. Bốn task đó đã được tính vào kết quả 35/50 cuối cùng.

Đây là bài học mình không nghĩ nhiều trước khi bắt đầu: benchmark framework cũng phải được debug và kiểm tra như hệ thống đang được benchmark. Một runner sai có thể tạo ra kết luận rất tự tin nhưng hoàn toàn sai.

## 3. LLM judge không thể là source of truth

Có trường hợp judge cho rằng patch đã đúng, nhưng container test vẫn fail. Một ví dụ là lỗi liên quan tới cách tính năm RFC-850: agent dựa vào `utcnow()`, trong khi test cố định năm 1971. Diff nhìn hợp lý nếu chỉ đọc bằng mắt, nhưng không đáp ứng đúng behavior mà test yêu cầu.

Từ đó mình đặt quy tắc rõ hơn:

> **Test quyết định score. LLM judge chỉ giải thích.**

Judge vẫn hữu ích để tóm tắt nguyên nhân và giúp phân loại failure. Tuy nhiên, nó không nên được phép ghi đè kết quả test. Nếu budget cho phép, judge cũng nên dùng model khác và mạnh hơn model đang được đánh giá để giảm việc lặp lại cùng một kiểu sai lệch.

## 4. Agent có thể “cheat” mà không biết mình đang cheat

Một số SWE-bench image giữ full git history. Trong task chạy lâu, agent dùng `git log` và `git show` để tìm những commit sau baseline, thấy implementation trong tương lai rồi thử backport nhiều phiên bản khác nhau.

Nó không cố tình gian lận theo nghĩa con người. Với agent, git history chỉ là một nguồn thông tin khác trong repository. Nhưng trong benchmark, hành vi này tạo ra leakage và làm kết quả không còn phản ánh đúng khả năng tự tìm lời giải từ issue cùng code ở baseline.

Trong cùng transcript, agent còn chỉnh `setup.py` hoặc `tox.ini`, sau đó tiếp tục mắc vào một vòng lặp dependency và test. Có task mất hơn 45 phút chỉ vì chuỗi thử nghiệm này.

Thay đổi harness hợp lý sau quan sát đó là:

- chặn hoặc giới hạn `git log`, `git show` và `git reflog` trong benchmark;
- bảo vệ các file dependency/config nhạy cảm, hoặc yêu cầu agent giải thích rõ trước khi sửa;
- đặt time budget cho từng pha để agent không dành phần lớn thời gian cho một hướng ít triển vọng.

## 5. Tool tốt không có nghĩa agent sẽ tự dùng đúng

Trong transcript, raw `bash` được gọi nhiều hơn `run_test` khoảng 10 lần. Mình đã tạo `run_test` để test có mục tiêu, giới hạn output và buộc agent chú ý tới trạng thái RED/GREEN. Nhưng chỉ vì tool tồn tại không có nghĩa model sẽ ưu tiên nó.

Đây là một tín hiệu thiết kế harness quan trọng. Vấn đề có thể nằm ở tên tool, description, prompt hoặc thời điểm tool được giới thiệu. Workflow mình muốn hướng tới rõ hơn:

1. tái hiện lỗi bằng test có mục tiêu;
2. sửa code;
3. chạy lại test vừa fail;
4. chạy regression test phù hợp;
5. chỉ kết thúc khi đã có bằng chứng xác thực.

Nếu tỷ lệ dùng `run_test` tăng nhưng pass rate không đổi, extension đó có thể chỉ làm transcript đẹp hơn. Nếu nó giúp giảm timeout hoặc tăng số task pass, khi đó mình mới có bằng chứng harness thực sự tốt hơn.

# Benchmark này đã trả lời được gì — và chưa trả lời được gì?

Lần chạy này cho mình một baseline cụ thể. Với một model, một config và một tập task cố định, hệ thống giải quyết được 35/50 task theo metric của pi-bench. Mình cũng có transcript để xác định một số failure đến từ reasoning, một số đến từ hành vi của harness, và một số đến từ evaluator.

Tuy nhiên, benchmark này chưa chứng minh được ba điều:

- **70% đến từ model hay harness?** Mình chưa chạy stock Pi với cùng model và cùng task.
- **DeepSeek V4 Flash có phải lựa chọn tốt nhất về chi phí hay không?** Mình chưa công bố so sánh cost, token và latency với các model khác.
- **Kết quả có giữ được trên task chưa từng dùng để debug hay không?** Sau khi đọc và sửa dựa trên 50 task này, tiếp tục tối ưu trên cùng tập có nguy cơ overfit harness vào benchmark.

Vì thế, mình xem 35/50 là điểm bắt đầu chứ không phải kết luận cuối cùng.

# Thí nghiệm tiếp theo: harness có thực sự tạo ra khác biệt?

Câu hỏi quan trọng nhất sau bài này không phải “model nào đạt điểm cao hơn?”. Nó là:

> **Giữ nguyên model, task và môi trường, custom harness của mình có tốt hơn stock Pi không?**

Thiết kế cho lần chạy tiếp theo sẽ chỉ thay đổi một biến:

| Biến | Run A | Run B |
| --- | --- | --- |
| Harness | Stock Pi | Pi + custom harness |
| Model và thinking level | Giữ nguyên | Giữ nguyên |
| Task, Docker image, baseline commit | Giữ nguyên | Giữ nguyên |
| Internet access và timeout | Giữ nguyên | Giữ nguyên |
| Attempts và scoring | `pass@1`, cùng cách chấm | `pass@1`, cùng cách chấm |

Để tránh overfit, mình sẽ chọn một holdout mới từ SWE-bench Verified mà harness chưa dùng để iteration, cố định task ID và không chỉnh harness giữa các run. Ngoài pass rate, mình muốn ghi thêm:

- tổng token và chi phí;
- cost trên mỗi task giải được;
- median và P90 duration;
- số lần gọi tool;
- tỷ lệ timeout;
- số lần agent kết thúc mà chưa verify;
- số thay đổi ngoài phạm vi issue.

Có hai kết quả đều đáng viết. Nếu custom harness tốt hơn rõ rệt, mình có bằng chứng extension tạo ra giá trị. Nếu stock Pi gần bằng setup gồm nhiều extension, đó cũng là một kết luận quan trọng: mình có thể đã xây nhiều thứ hơn mức cần thiết.

Chỉ sau thí nghiệm này mình mới muốn cố định một phiên bản harness và chạy model shootout. Khi đó, metric đáng quan tâm sẽ không chỉ là pass rate mà còn là **cost per solved task**.

# Kết luận

Điều mình muốn từ pi-bench không phải một con số để chứng minh setup của mình “xịn”. Mình muốn một feedback loop đủ rõ:

1. version-control harness;
2. chạy nó trên task thật;
3. đọc failure thay vì chỉ nhìn score;
4. thay đổi một giả thuyết cụ thể;
5. benchmark lại trên task chưa dùng để tối ưu.

Pi phù hợp với cách làm này vì gần như toàn bộ workflow có thể được biểu diễn thành code. Extension, tool, prompt và guard đều có thể review, test, tag phiên bản rồi so sánh qua các lần chạy.

Sau benchmark đầu tiên, mình biết setup hiện tại đạt 35/50. Nhưng mình vẫn chưa biết 35 task đó pass nhờ DeepSeek hay nhờ những extension mình đã xây.

**Bài tiếp theo sẽ chỉ thay đổi một biến: harness.**
