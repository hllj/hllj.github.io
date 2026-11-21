---
title: "wreck-it-ralph: ghép harness, Ralph loop và loop engineering để agent không tự chấm điểm cho mình"
categories: blog
classes: wide
tags:
  - vietnamese
  - claude-code
  - agent
  - harness
  - ralph-loop
  - loop-engineering
toc: true
toc_label: "Table of Contents"
toc_icon: "cog"
toc_sticky: true
---

Trong 2 ngày (17–18/11/2026) mình làm một Claude Code plugin tên **wreck-it-ralph** (TODO: thêm link repo nếu public). Nó ghép ba ý tưởng có sẵn. Bài này giải thích từng ý tưởng một cách ngắn gọn, nói plugin lấy gì từ mỗi ý, rồi kể mình đã dùng nó để trùng tu giao diện đọc bài của chính blog này ra sao.

> **Làm sao để agent làm một việc dài hơi, qua nhiều session, mà mình vẫn tin kết quả?**

> **TL;DR** — Ý chính: agent viết code **không bao giờ** là agent quyết định code đó pass, và các luật dừng, kiểm tra, ngân sách nằm trong script chứ không nằm trong prompt. Trên blog này, plugin đưa 65 feature lên pass qua 83 session. Nhưng đó mới là một mẫu duy nhất, mình chưa so với cách đơn giản hơn, nên chưa dám nói "tốt hơn".

# Ba ý tưởng nền

## 1. Harness cho agent chạy dài: mỗi session là một ca trực không có bàn giao

Bài [Effective harnesses for long-running agents](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) (Anthropic, 11/2025) bắt đầu từ một vấn đề rất đời: agent làm việc theo từng session, và session mới không nhớ gì về session trước, như kỹ sư vào ca mà không ai bàn giao. Bài mô tả hai kiểu thất bại:

- **One-shot**: agent cố làm cả app trong một lần, hết context giữa chừng, để lại một feature làm dở và không ghi chép gì.
- **Tuyên bố thắng sớm**: có vài feature rồi, một agent sau nhìn quanh và kết luận "xong rồi".

Cách chữa của họ là dựng một "hiện trường bàn giao" bằng file: một *initializer* chạy một lần để viết `feature_list.json` (hơn 200 feature, ban đầu đều `passes: false`, mỗi feature có `steps`), file progress, `init.sh` và commit đầu tiên. Các session sau chỉ làm **một** feature, test như người dùng thật (họ dùng browser automation vì chỉ chạy unit test hoặc `curl` thì agent hay đánh dấu xong khi chưa xong), rồi commit và ghi progress. Agent chỉ được đổi trường `passes`. Họ chọn JSON vì model ít tự ý sửa JSON hơn Markdown.

Bài này cũng để ngỏ hai câu hỏi: một agent tổng quát hay nhiều agent chuyên biệt (tester, QA, cleanup) thì tốt hơn, và ngoài web app thì sao.

**Plugin lấy gì:** toàn bộ khung này (initializer, `feature_list.json`, `init.sh`, progress, một feature mỗi session). Và plugin trả lời câu hỏi mở thứ nhất theo hướng "tách vai": coder và tester là hai agent khác nhau.

## 2. Ralph loop: cứ đưa lại cùng một việc, mỗi vòng một context mới

[Ralph](https://ghuntley.com/ralph/) của Geoffrey Huntley, ở dạng thuần nhất, là một vòng `while` bằng bash đưa cùng một file prompt cho agent hết lần này đến lần khác. Mỗi vòng, agent bắt đầu với context mới, chọn một việc quan trọng nhất trong file kế hoạch, làm, chạy test, commit, rồi vòng lặp quay lại. Vài ý đáng nhớ trong bài:

- **Một việc mỗi vòng**, và đầu vào ổn định là file kế hoạch cùng thư mục spec, được nạp giống nhau ở mỗi vòng.
- **"Backpressure" mới là phần việc kỹ thuật thật**: test, type checker, static analyzer, tất cả những gì từ chối đầu ra xấu. Ralph chỉ chạy tốt khi có thứ chặn nó lại.
- Tác giả nói thẳng nó hợp với dự án mới bắt đầu ("sẽ được khoảng 90%") và ông sẽ không dùng nó trên codebase có sẵn. Các lỗi quen thuộc: agent `grep` rồi kết luận sai là code chưa có và viết trùng, code giả (placeholder), spec sai, và sáng ra codebase không build được, lúc đó tùy người vận hành chọn `git reset --hard` hay prompt thêm.

**Plugin lấy gì:** vòng lặp "thử lại trong context mới" làm vòng trong. Bản Ralph gốc có hai điểm yếu mà plugin cố sửa (và mình nhận ra khi đọc lại): agent tự tuyên bố xong bằng một "promise", và chỉ có số vòng lặp làm giới hạn. Plugin vẫn giữ nguyên chế độ Ralph trong một session (`/wreck-it-ralph:ralph`) cho việc nhỏ, nhưng thêm `--verify`: hook chạy lệnh kiểm tra thật, nên nói "xong rồi" thôi thì chưa đủ để dừng.

## 3. Loop engineering: thiết kế cái vòng lặp, không chỉ viết prompt

Thuật ngữ này nổi lên khoảng tháng 6/2026. Hai bài mình đọc ([IBM](https://www.ibm.com/think/topics/loop-engineering) và [MindStudio](https://www.mindstudio.ai/blog/what-is-loop-engineering-ai-coding-agents)) cùng định nghĩa nó là thiết kế hệ thống trong đó agent hành động, quan sát kết quả, điều chỉnh rồi lặp lại cho tới khi đạt mục tiêu, với rất ít can thiệp của người. Việc của kỹ sư dịch chuyển từ viết prompt sang thiết kế *vòng lặp thúc đẩy, kiểm tra và dẫn dắt* agent.

Các bài trong tài liệu mình thu thập (xem `docs/ROADMAP-v3.md` trong repo) thống nhất một vòng lặp tốt cần những khối sau:

| Khối | Ý nghĩa |
| --- | --- |
| Trigger | Bắt đầu bằng tay, theo lịch (cron), hoặc theo sự kiện (CI fail, issue mới) |
| Trạng thái bền ("spine") | File hay tracker mà agent cập nhật mỗi chu kỳ |
| Verifier độc lập | Test suite, rồi tới agent kiểm tra riêng, rồi mới tới model-làm-giám-khảo. Không bao giờ tự chấm |
| Luật dừng và trạng thái kết thúc có tên | thành công / bị chặn / hết ngân sách / kẹt / cần người |
| Ngân sách | token, tiền, thời gian, kích thước diff |
| Quyền và cô lập | allowlist công cụ, worktree, cổng merge |
| Leo thang cho người | điểm bàn giao rõ ràng |
| Triển khai theo bậc | L1 chỉ báo cáo, L2 có người hỗ trợ, L3 tự chạy |

Các anti-pattern hay gặp: không có điều kiện thoát, thử lại đúng cách đã fail, tràn context, mục tiêu mơ hồ, và tự chấm điểm.

**Plugin lấy gì:** bảng trên gần như là danh sách việc của mình. Phần lớn công sức 2 ngày đi vào đây.

## Cách ba ý tưởng khớp nhau

Mình hình dung như sau (đây là cách mình ghép, không phải định nghĩa chính thức):

- **Ralph** là vòng *trong*: cứ làm một việc cho tới khi verifier gật đầu.
- **Harness** là vòng *ngoài*: một hàng đợi các việc kiểm tra được, mỗi việc một context mới, trạng thái nằm trên đĩa.
- **Loop engineering** là kỷ luật thiết kế bao trùm cả hai: biến trigger, verifier, luật dừng, ngân sách, leo thang thành thứ khai báo rõ ràng trong config và được script (gọi là *gate*) thực thi.

# Plugin có gì hay sau khi ghép

Mỗi session chạy một đường thẳng:

```
chọn feature sẵn sàng → coder (context mới) → chạy lệnh verify → tester (context mới) → kiểm tra cuối session
```

1. **Coder chỉ được `claim`, tester mới được `pass`** (từ harness + loop engineering: verifier độc lập). Cuối session, feature nào thành `passing` mà chưa được claim sẽ bị reset. Mình thêm cơ chế này vì ban đầu chỉ dặn trong prompt, mà lệnh `pass` thì ai cũng gọi được.
2. **Lệnh `verify` chạy trong gate, không chạy trong agent** (từ Ralph: backpressure). Fail thì bỏ qua tester luôn, đỡ tốn tiền.
3. **Danh sách feature bị khoá** (từ harness: agent không được sửa spec). Agent lỡ sửa thì gate khôi phục. Muốn thêm hoặc sửa việc phải qua một *proposal* và người duyệt, nên backlog vẫn lớn dần được sau khi khoá.
4. **Retry có trí nhớ** (từ Ralph, sửa anti-pattern "thử lại đúng cách đã fail"). Lần thử sau được báo vì sao lần trước fail.
5. **Có trạng thái "cần người"** (từ loop engineering: leo thang). Fail liên tiếp 3 lần thì feature chuyển sang `needs_human` và vòng lặp đi làm feature khác chứ không kẹt.
6. **Tester bị buộc nghi ngờ.** Nó phải đọc mục "Known issues" của coder và thử thêm vài input ngoài các step. Mình thêm luật này sau một trial mà tester pass một feature dù coder đã ghi rõ ký tự `ß` bị bỏ.
7. **Ngân sách, trigger và triển khai theo bậc** (từ loop engineering): giới hạn số session, chi phí, thời gian, kích thước diff; sinh sẵn dòng cron, LaunchAgent hay workflow GitHub Actions; chạy thử ở L1 trên branch riêng trước khi cho chạy thẳng.
8. **Bộ nhớ có chọn lọc.** Một agent *curator* cứ 10 session chắt lọc `progress.md` thành `learnings.md` ngắn, mọi agent đọc trước tiên.

Phần "thông minh" của cả dự án chỉ khoảng 170 dòng prompt. Còn lại là hơn 3000 dòng bash và `jq` để giữ luật.

# Thực nghiệm: trùng tu giao diện đọc bài của blog này

Mình muốn nâng cấp trải nghiệm đọc bài của blog (theme Minimal Mistakes): typography, TOC, dark mode, code block, ảnh... (TODO: bạn thêm một câu về lý do thật sự và ảnh trước/sau). Mình giao việc đó cho harness với preset `web`, tức tester điều khiển trình duyệt thật.

**Bước 1 — lập backlog.** Initializer tách mục tiêu thành 42 feature nhỏ, mỗi feature có `steps` và lệnh `verify`. Ví dụ: thanh tiến độ đọc, TOC tô sáng mục đang xem, nút copy cho code block, lightbox ảnh, dark mode, bảng cuộn ngang trên màn hình nhỏ, print stylesheet, trang 404.

**Bước 2 — vòng lặp.** Mỗi session làm một feature. Coder sửa SCSS và JS (kết quả là `_post-ux.scss` khoảng 1000 dòng và `post-ux.js` khoảng 400 dòng), chạy build rồi claim. Tester mở trang thật ở các độ rộng 375, 768, 1280 px, light và dark, đo DOM, thử đóng mở bằng phím Escape, và pass hoặc fail.

**Bước 3 — nhìn lại và thêm việc.** Đây là chỗ backlog "sống" có ích. Xong 42 feature, còn nhiều chỗ chưa ổn: breadcrumb lệch hàng, nút "back to top" bị tràn chữ, thẻ bài trên trang chủ chồng lên đường kẻ, TOC trông như có một cái hộp thừa. Những nhận xét đó thành 23 feature mới (F043–F065) qua proposal để mình duyệt (TODO: xác nhận nhận xét là của bạn). Vài feature ghi thẳng là `REWORK` kèm lời nhận xét, ví dụ "tôi thấy có một cái hộp bao quanh nút này", và TOC được làm lại nhiều lần (F045, F046, F059, F062–F065) cho tới khi đúng ý (hiện là một nút nằm trong cột trái, mở ra danh sách *bên dưới* nút, cuộn được).

Con số cuối cùng:

| | |
| --- | ---: |
| Feature | 65/65 pass (42 ban đầu + 23 thêm sau) |
| Session | 83 |
| Sự kiện pass / fail | 71 / 11 |
| Feature phải làm lại hơn 2 lần | 15 |
| Thời gian | khoảng 7 tiếng (13:37 – 20:59) |

Một chi tiết nhỏ mình thích: `learnings.md` do curator viết ghi lại những bài học mà session mới sẽ không tự biết. Ví dụ ảnh chụp từ Browser pane bị trống nên phải dùng headless Chrome; hoặc chỉ đo `scrollWidth` thì bỏ sót lỗi, phải kiểm tra đúng triệu chứng mình nhìn thấy.

# Nên đọc những con số này thế nào?

- **Một project, một lần chạy.** 65/65 là một mẫu, không phải tỉ lệ. Cũng nên nhớ Huntley khuyên Ralph cho dự án mới, còn đây là sửa một codebase có sẵn.
- **"Pass" do tester của harness chấm**, cùng họ model với coder. Mình chưa duyệt lại từng feature bằng mắt, và các `REWORK` ở trên chính là những lần mắt người bắt được thứ tester đã cho qua.
- **Chưa có baseline.** Mình không biết một vòng lặp đơn giản kiểu "build + vài lệnh kiểm tra" có cho kết quả tương đương hay không.
- **Không biết chi phí.** Chế độ interactive không ghi đô la, chỉ có token.
- **Còn nợ kỹ thuật.** Bộ test có 334 check, trong lần chạy của một subagent đánh giá độc lập thì 1 check fail (`stale wrapper fails with a helpful message`), mình chưa điều tra. Config thiếu khoá `permission_mode` sẽ rơi về `bypassPermissions`, trái với README. Và `git add -A` vẫn được dùng để commit tự động.

# Kết luận

1. **Luật quan trọng nên nằm trong code.** Prompt chỉ là lời đề nghị, gate mới là luật.
2. **Verifier quan trọng hơn agent thông minh hơn.** Cả ba nguồn đều quay về đây: test, backpressure, verifier độc lập.
3. **Chưa đo thì chưa được nói là tốt hơn.** Harness cũng là software.

# Việc tiếp theo

1. Sửa check đang fail, đổi mặc định quyền về `acceptEdits`, thay `git add -A` bằng danh sách cho phép kèm quét secret.
2. Chạy so sánh có đối chứng: một vòng `claude -p` đơn giản, coder + gate, và coder + gate + tester, trên 20–30 task, lặp ít nhất 3 lần, đo tỉ lệ false-pass.
3. Cài bug có chủ đích để xem tester bắt được bao nhiêu, và thử tester dùng model khác họ.

Credits: [Effective harnesses for long-running agents](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) của Anthropic, kỹ thuật [Ralph Wiggum](https://ghuntley.com/ralph/) của Geoffrey Huntley, bài về loop engineering của [IBM](https://www.ibm.com/think/topics/loop-engineering) và [MindStudio](https://www.mindstudio.ai/blog/what-is-loop-engineering-ai-coding-agents), và plugin Ralph Loop gốc (Apache-2.0) mà mình fork ra.

> Một cái harness đáng tin là cái bạn đã thử bóp cổ nó rồi, không phải cái chạy đẹp ở lần đầu :)
