---
name: blog-writing-style
description: Viết hoặc chỉnh sửa bài blog cho hllj.github.io (Jekyll, Minimal Mistakes) theo đúng giọng văn và cấu trúc của tác giả hllj — tiếng Việt, xưng "mình", thẳng thắn, tự giễu nhẹ, thiên về số liệu và bài học. Dùng khi người dùng nhờ viết bài mới, viết nháp, dịch, review hoặc sửa văn phong một bài trong _posts/ hay _drafts/.
---

# Phong cách viết blog của hllj

Skill này được rút ra từ việc đọc lại toàn bộ 19 bài trong `_posts/` (blog, deep-learning, machine-learning, personal, projects, reading, tools; 2021–2026). Mục tiêu: bài mới đọc lên phải như chính tác giả viết, không giống văn mẫu của AI.

## 1. Giọng văn cốt lõi

- **Ngôn ngữ**: tiếng Việt là mặc định (tag `vietnamese`). Chỉ viết tiếng Anh khi người dùng yêu cầu (bài setup blog 2021 là ngoại lệ, tag `english`).
- **Ngôi xưng**: "mình" với người đọc là "bạn / các bạn / mọi người". Nói về nhóm: "tụi mình", "team mình", "bên mình". Không dùng "tôi" (trừ khi dịch bài của người khác và giữ giọng tác giả gốc, xem mục 7).
- **Như đang kể chuyện cho đồng nghiệp/em trong ngành**: thân mật, nói thẳng, không trang trọng, không "kính thưa", không giọng giáo viên.
- **Trung thực về thất bại và giới hạn**. Đây là nét đặc trưng nhất. Bài hay nhất của tác giả là bài "không medal", "35/50 nhưng 15 task fail mới thú vị", "chưa chắc 90% có nghĩa là tốt hơn". Luôn nói rõ: cái gì không làm được, cái gì không chắc, cái gì là may mắn, cái gì là lỗi của chính mình.
- **Tự giễu nhẹ nhàng**: "thử coi mình sai ở chỗ nào và ngu ở chỗ nào :))", "trick lỏ", "hên xui", "chôm được kha khá source code", "cực hình", "méo dễ ăn tí nào". Chỉ một nhịp đùa mỗi vài đoạn, không biến cả bài thành hài.
- **Có chính kiến, nói rõ đánh giá chủ quan**: "đây là đánh giá chủ quan của mình", "cá nhân mình thấy", "theo quan sát của mình". Phân biệt rạch ròi *quan sát định tính* và *kết quả có số liệu*.
- **Khiêm tốn về công lao, rõ về đóng góp**: ghi công người khác bằng tên + link (tác giả public weights, repo, bài gốc, đồng đội). Nói rõ "phần của mình là X", "phần này không phải của mình".

## 2. Từ vựng và nhịp câu

- **Trộn Anh–Việt tự nhiên**: giữ nguyên thuật ngữ kỹ thuật tiếng Anh (harness, benchmark, pass rate, ensemble, fine-tune, learning rate, leaderboard, baseline, regression, transcript, retry, prompt, checkpoint...). Lần đầu gặp thuật ngữ khó thì giải thích ngắn bằng tiếng Việt trong ngoặc, ví dụ "hypothesis function (có thể gọi là Hàm giả định...)".
- **Từ nối / khẩu ngữ hay dùng**: "Nói thật là...", "Thật ra", "Nôm na", "Nói chung là", "Mình thấy", "Có thể", "Có lẽ", "Tuy nhiên", "Ngoài ra", "Tiếp theo", "Như mọi khi", "Cuối cùng".
- **Emoticon kiểu Việt**: `:)`, `:))`, `:)))`, `:D`, `:^)`, `:')`, `:(`. Dùng ở cuối câu đùa hoặc câu tự giễu, ít (vài lần mỗi bài), không dùng emoji hình.
- **Câu dài vừa phải, nhiều mệnh đề nối bằng dấu phẩy**, xen câu ngắn đanh để chốt ý. Chấp nhận câu hơi "nói miệng".
- **In đậm** để nhấn con số, kết luận, cụm then chốt (`**35/50 task pass — 70%**`). Dùng `—` (gạch dài có khoảng trắng) để chen vế phụ. Dùng `*nghiêng*` để nhấn nhẹ.
- **Con số cụ thể, chính xác, có ngày tháng**: "99 experiment, 66 submission", "ngày 22/10", "kém khoảng 0.002", "10 task trong 50". Không viết "khá nhiều", "rất tốt" khi có số để đưa.
- **Kỹ thuật**: tên file, lệnh, config, extension luôn để trong `backticks`. Link thẳng tới repo GitHub, doc, discussion, bài gốc.

## 3. Cấu trúc bài (đặc biệt với bài kỹ thuật / kinh nghiệm 2026)

Thứ tự lặp lại trong các bài mạnh nhất:

1. **Mở đầu 1–3 đoạn**: nêu ngay bối cảnh và câu hỏi/kết quả chính. Nói thẳng cái gì sẽ không có trong bài hoặc cái gì cần lưu ý trước (ví dụ "toàn bộ weights trong final pick đều là public weights của người khác").
2. **Câu hỏi hoặc luận điểm in trong blockquote**: `> **Những extension mình thêm vào có thực sự giúp agent tốt hơn không?**`
3. **`> **TL;DR** — ...`** một đoạn blockquote, nêu kết quả *và* chỗ cần dè dặt. TL;DR của tác giả không chỉ là kết quả, mà luôn có vế "nhưng điều đáng chú ý hơn là...".
4. **Bảng tổng quan kết quả** (Markdown table, cột số căn phải `---:`) ngay đầu bài, trước khi đi vào chi tiết.
5. **Thân bài**: heading `#` cho phần lớn, `##` cho phần con. Heading thường là một **câu nhận định hoặc câu hỏi**, không phải nhãn khô: "Trước hết: 35/50 thực sự có nghĩa là gì?", "Tại sao không có medal", "Nên đọc những con số này thế nào?", "Một task có khả năng cao là dữ liệu hỏng".
6. **Mục "đọc con số cho đúng"**: các caveat (mẫu số, nhiễu, rò rỉ, cách chấm khác official). Tác giả luôn tự phản biện kết quả của mình trước khi người đọc kịp làm.
7. **Kết luận**: 2–3 điều học được, đánh số, một câu một ý. Thường có một câu "gói" đáng nhớ (ví dụ "harness cũng là software", "benchmark cũng là software, và nó rò rỉ theo đúng những cách mà software hay rò rỉ").
8. **Việc tiếp theo**: danh sách đánh số những việc sẽ làm, nói thật là thứ tự đã đổi so với lời hứa trước.
9. **Credits / Links** ở cuối nếu dùng đồ của người khác; kết bằng một câu mời gọi nhẹ ("Nếu bạn quan tâm phần nào cụ thể, cứ hỏi mình.") hoặc một câu đùa/châm ngôn ngắn trong blockquote.

Với bài nhiều phần: liên kết bài trước bằng `{% post_url blog/<ten-file-khong-duoi-md> %}` và có mục "Xem những phần trước".

## 4. Tùy theo thể loại

| Thể loại | Cách viết |
| --- | --- |
| **blog / kỹ thuật (2026)** | Số liệu, bảng, TL;DR, tự phản biện, bài học rút ra, danh sách "Work / Không work", "Việc tiếp theo". Giọng điềm tĩnh, phân tích, có chút hài. |
| **personal / tâm sự** | Mở bằng một lời thú nhận ("mình không đủ dũng cảm...", "mình quyết định bật hai lon bia"). Dùng một hình ảnh ẩn dụ xuyên suốt (sợi dây bện). Chia theo cảm xúc: thành công / thất bại → bất ngờ / mất mát → ngẫm nghĩ & tương lai. Kết bằng lời cảm ơn cá nhân và một câu châm ngôn trong blockquote. Cảm xúc thật, không thi vị hóa quá mức. |
| **cuộc thi / kể lại hành trình** | Theo trình tự thời gian ("tuần đầu", "tuần thứ 2"), kể cả giai đoạn "ác mộng"/"loay hoay". Nêu quyết định, lý do, và đánh giá chủ quan. Kết bằng "không ai thắng hay thua, ai cũng học được gì đó" + cảm ơn team. |
| **machine/deep learning giảng giải** | Đi từ trực giác đến toán: nêu bài toán (Input/Output) → ý tưởng một câu → công thức LaTeX `$...$` → code PyTorch ngắn → hình minh họa. Báo trước phần nặng toán và cho người đọc đường tắt ("nếu ngại, kéo xuống phần Kết luận :^)"). Giải thích bằng ví dụ gần gũi, hạn chế hàn lâm. |
| **projects** | Dạng nhật ký/ghi chú: "Update ngày dd/mm/yyyy", mở bằng động cơ ("Dự án này được hai đứa em kêu gọi..."), liệt kê thành phần bằng gạch đầu dòng, rồi mô tả những gì thử, cái gì không hiệu quả, cách sửa. Ghi công bạn cùng làm. Có mục "Project information" với link HF/GitHub. |
| **reading / tóm tắt sách** | Ngắn, mỗi chương một `##`, tóm ý rồi nối với đời sống. Dùng "chúng ta" nhiều hơn, giọng suy ngẫm. Mở bằng câu "mỗi ngày mình sẽ cố đọc một chương... Hãy đọc cùng mình." |
| **tools / hướng dẫn** | Nói "vì sao dùng" trước "cách dùng", giọng vui ("old school và ngầu lòi :')"), lệnh trong code block `bash`, gif/ảnh minh họa, chốt bằng vài mẹo thực tế. |
| **dịch bài người khác** | Giữ giọng tác giả gốc (xưng "tôi"), chèn chú thích `(ND: ...)`, ghi rõ link bài gốc và tên tác giả ngay đầu bài. |

## 5. Những điều nên làm

- Bắt đầu từ **câu hỏi thật** mà tác giả muốn trả lời, không bắt đầu bằng định nghĩa sách giáo khoa (trừ bài giảng giải).
- **Đo trước khi khẳng định**; nếu không đo được, nói là quan sát định tính.
- Nêu **cả thứ không work** — bảng hoặc danh sách "Work / Không work".
- Tách bạch: *cái gì của mình*, *cái gì của người khác*, *cái gì do may mắn/nhiễu*.
- Trích dẫn nguồn, link repo, link bài gốc; để đường dẫn ở dạng Markdown link `[text](url)`.
- Có **hình/bảng/sơ đồ** minh họa; chú thích dưới hình bằng `*Hình N. ...*` (bài kỹ thuật) hoặc `<div align="center" style="font-style: italic">...</div>` (bài cũ).
- Kết bài bằng **bài học đánh số** và **việc tiếp theo**, không kết bằng lời hô hào chung chung.

## 6. Những điều tránh

- Văn mẫu AI: "Trong thế giới ngày nay...", "Hãy cùng khám phá...", "Tóm lại, ... là một công cụ mạnh mẽ", "không thể phủ nhận", "đóng vai trò quan trọng", mở bài/kết bài sáo rỗng.
- Phóng đại thành tích hoặc nói "state-of-the-art/đột phá" khi không có bằng chứng. Tác giả tự hạ con số của mình chứ không tô.
- Quá nhiều emoji, quá nhiều gạch đầu dòng ngắn cụt thay cho lập luận. Gạch đầu dòng chỉ để liệt kê thật, còn lập luận viết thành đoạn.
- Dịch máy toàn bộ thuật ngữ (không viết "tập tin xác thực" thay `validation set`, "đường ống" thay `pipeline`).
- Giọng dạy đời hoặc quá trang trọng. Đừng đóng vai chuyên gia; tác giả là người đang thử và học.
- Bịa số liệu, ngày, link, hoặc kết quả chưa có. Nếu thiếu dữ liệu, hỏi tác giả hoặc để `TODO:` rõ ràng.

## 7. Front matter chuẩn (Minimal Mistakes)

Đặt file ở `_posts/<category>/YYYY-MM-DD-ten-bai.md` (nháp để ở `_drafts/`). Category hiện có: `blog`, `deep-learning`, `machine-learning`, `personal`, `projects`, `reading`, `tools`, `photograph`.

```yaml
---
title: "Tiêu đề dạng nhận định, có thể kèm con số — và một vế 'nhưng'"
last_modified_at: YYYY-MM-DD   # chỉ khi cập nhật
categories: blog                 # trùng tên thư mục con
classes: wide
tags:
  - vietnamese
  - <chủ-đề>
toc: true
toc_label: "Table of Contents"   # bài cũ dùng "My Table of Contents"
toc_icon: "cog"
toc_sticky: true                 # tùy bài
header:
  teaser: "/images/<ten-anh>"
  overlay_image: "/images/<ten-anh>"
  overlay_filter: 0.7            # personal dùng 0.5
  overlay_color: "#005eff"
---
```

- Tiêu đề hay dùng: dấu hai chấm, gạch dài, con số cụ thể, tiền tố `[Tâm sự]` cho bài cá nhân. Ví dụ: "Từ 70% lên 90% ... — nhưng cái gì đã work, cái gì không".
- Ảnh để trong `/images/` (bài RSNA dùng thư mục con `/images/rsna-knee/`). Dùng đường dẫn tuyệt đối từ gốc: `![mô tả](/images/xxx.png)`.
- Link nội bộ giữa các bài: `{% post_url <category>/<ten-file> %}`.
- Công thức toán: `$inline$` và `$$block$$`; code block ghi rõ ngôn ngữ (` ```python `, ` ```bash `).

## 8. Quy trình khi được nhờ viết bài

1. **Hỏi/nhận đủ nguyên liệu**: chủ đề, kết quả/số liệu thật, link repo, ảnh, ai đã giúp. Không đoán số.
2. **Chọn thể loại** theo bảng mục 4 và dựng dàn ý theo mục 3 (với bài kỹ thuật: bảng kết quả + TL;DR trước).
3. **Viết nháp tiếng Việt, ngôi "mình"**, chèn thuật ngữ Anh tự nhiên, một vài nhịp đùa `:)`, caveat và tự phản biện.
4. **Tự kiểm tra** bằng danh sách này trước khi giao:
   - [ ] Mở bài nêu được câu hỏi / kết quả chính trong vài câu đầu?
   - [ ] Có số liệu cụ thể và có caveat về cách đọc số đó?
   - [ ] Có nói phần thất bại / không chắc chắn / công của người khác?
   - [ ] Heading là câu nhận định hay nhãn khô? (ưu tiên nhận định)
   - [ ] Kết bằng bài học đánh số + việc tiếp theo (với bài kỹ thuật)?
   - [ ] Không có câu sáo kiểu AI, không emoji hình, emoticon `:)` đúng chỗ, không quá nhiều?
   - [ ] Front matter, đường dẫn ảnh, `post_url` đúng chuẩn?
5. Lưu vào `_drafts/` trước nếu người dùng chưa duyệt; chuyển sang `_posts/<category>/` với tiền tố ngày khi xuất bản.

## 9. Câu mẫu để bắt giọng

- "Con số đó khá tốt đối với một setup cá nhân. Tuy nhiên, phần có ích nhất của lần benchmark này không nằm ở 35 task đã pass."
- "Nhìn qua thì đây là một sự tiến triển rất tốt, score tăng lên rất đẹp. Nhưng khi đọc lại transcript, mình thấy con số này kể một câu chuyện khác."
- "Không có medal vì mình không có 'thứ riêng' nào đủ mạnh — không phải vì thiếu experiment."
- "Nói thật thì team mình cũng chẳng EDA gì nhiều, chỉ cảm nhận rằng..."
- "Mình xác định bài toán này nên làm đơn giản, cứ cắt frame ra rồi phân loại là real/fake."
- "Đừng tin vào số liệu của các công ty AI đưa ra về SWE-Bench hay Terminal Bench, biết đâu họ cũng vô tình (hay là hữu ý) lỡ để cho các con model mình trick lỏ thì sao :)"
- "Không có niềm vui gì là tột cùng, không có nỗi buồn nào là mãi mãi."
