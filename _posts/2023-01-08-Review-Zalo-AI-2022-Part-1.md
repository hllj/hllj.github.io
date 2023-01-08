---
title: "Top 2 Zalo AI Challenge 2022 và một số cảm nhận của bản thân - Phần 1"
classes: wide
categories:
  - sharing
tags:
  - vietnamese
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
toc_sticky: true
header:
  overlay_image: "/images/2022-thumb.jpeg"
  overlay_filter: 0.5
  overlay_color: "#005eff"
---
Top 2 Zalo AI Challenge 2022 và một số cảm nhận của bản thân mình về kết quả trên.
# Mở đầu
Phải nói thật, mình khá nghiêm túc với cuộc thi lần này, vì các cuộc thi trước mình đều làm với tâm thế cho vui, nhưng lần này có thể khác vì mình team up với vài người trên công ty, có những kinh nghiệm tương đối hơn những lần trước. Thêm vào đó, lần này mình còn được tiết lộ sớm thời gian cuộc thi và một số thông tin về các track, coi như đó là một sự khởi đầu tốt.

Nhưng tới khi vào làm thật sự, mình mới cảm thấy hơi thất vọng về đề bài, cũng chia sẻ thật là mình không biết làm track về NLP và Voice, mình chỉ tập trung vào đề bài Computer Vision, mình thấy đề Computer Vision qua các năm càng thiếu sự đầu tư. Trong những năm đầu tiên của Zalo AI có một số bài khá hay như Generate thiết kế xe, Phát hiện biển báo giao thông; nhưng 2 năm trở lại đây thì lại khá chán khi đa số là Image Classification thuần, nhưng đặc biệt năm nay có nhiều thứ mình cảm thấy đề bài này thiếu sự đầu tư hơn so với 2 track còn lại. Track Computer Vision lần này là Liveness Detection, phát hiện một video mặt người là real/fake. Mình cũng từng làm qua bài toán này trước đây ở công ty, có thể gọi bài toán này là Anti-Spoofing, với track lần này của Zalo đưa ra thì nó tương tự như Anti-Spoofing với dạng attack là replay. Có thể là một sự may mắn tiếp theo.

Qua những kinh nghiệm trước đây mình làm Zalo AI, có thứ luôn phải làm đầu tiên là xem data, đúng nghĩa coi từng mẫu data BTC cung cấp, vì dữ liệu của BTC làm thường có nhiễu nhiều và đòi hỏi cần làm sạch (hoặc dùng mô hình). Mình khá bất ngờ vì dữ liệu lần này tương đối ít, số lượng nhiễu cũng không nhiều. Mình trải qua giai đoạn Explore Data khá nhanh, BTC phân dữ liệu đều, các mẫu cũng ít nhiễu; nhưng mình lại không hài lòng lắm về cách chia dữ liệu train/test. Team mình phát hiện là nhiều người ở tập train cũng xuất hiện trong tập test, chỉ khác nhãn real hay fake; theo mình đánh giá đây là một dạng data leakage, có thể coi là một thử thách của BTC đưa ra.

# Thành công bước đầu
Mình xác định bài toán này nên làm đơn giản, cứ cắt frame ra rồi phân loại là real/fake, bài toán Video nay chuyển về bài toán ảnh. Nói thật thì team mình cũng chẳng EDA (Explore Data Analysis) gì nhiều, chỉ cảm nhận rằng cách chia dữ liệu huấn luyện theo id video trước rồi mới tiến hành cắt frame.

Trong tuần đầu tiên, team mình đã có baseline đầu tiên, trong vài ngày đầu code được setup bởi một đứa em trong team sử dụng Pytorch Lightning. Như đã nói ở trên, lần mình đã nghiêm túc với cuộc thi hơn, mình dành ra hơn 1 ngày tiếp theo viết các phần nền cơ bản, chia dữ liệu, viết sườn huấn luyện, config các module cho baseline. 

Sau đó tới ngày thứ 2 trong tuần đầu, mình quyết định xài thư viện timm (Py**t**orch **Im**age **M**odels) và tham khảo source code từ các cuộc thi trước của Kaggle. Có vẻ kinh nghiệm làm việc đã cho mình những quyết định này, mình đã dành thời gian đọc qua các solution của các cuộc thi liên quan tới Image Classification [tại đây](https://farid.one/kaggle-solutions/?fbclid=IwAR1ujI-ABjWhROlQCNZpxliD4eS3TxXZLylVQdnqQh1PkVFOsAnNecAmJVk) và chôm được kha khá source code cũng như các backbone người ta hay xài. Cứ viết thêm một file tạo submission thế mà triển thôi. 

![One library to rule them all](/images/timm.png)
<div align="center" style="font-style: italic">
timm - one library to rule them all
</div>

Mọi thứ đã xong, train thử baseline với mô hình EfficientNet-B4, mình cũng bắt chước một số mô hình mà trên Kaggle người ta hay xài, pretrain ImageNet-1K, ImageNet-22K, Noisy Student, ... và kết quả nhận được cao đến khó tin, Train Accuracy 99%, Validation Accuracy 99%, không thể tin nổi mới baseline thôi.

![Wow-shit baseline](/images/baseline.png)
<div align="center" style="font-style: italic">
Baseline sau 2 ngày đầu tiên
</div>

Team mình lúc đó leo thẳng lên top 3 gì đấy, mọi người trong team bất ngờ về kết quả này tới nỗi bắt đầu có niềm tin hơn và nhảy vào làm. Mình thật tình cũng không ngờ tới kết quả này. Và tiếp theo đó là chuỗi ngày leo rank, gần như mỗi ngày team mình lại nghĩ ra một vài trick kiểu: chọn threshold để phân ngưỡng cho ra kết quả tốt hơn, phân tích metric đoán số ảnh bị sai, tuning tham số, grid search với sheet tuning dài cả trăm experiment :))

Cái trò mò metric để đoán ra số ảnh sai cũng là ý tưởng nhất thời của 2 anh trong team mình. Họ viết ra một metric theo BTC rồi bắt đầu brute force, vì các prediction đã được đưa về 0 hoặc 1, nên từ đó dễ dàng đoán ra được chính xác số lượng video sai có thể. Đến hết tuần đầu tiên team mình đã xác định được model chỉ sai 2 video trên Public Test, sau đó so sánh đối chiếu với các mô hình để tìm ra được submission tối ưu cho ra score 0.00 ngay lúc đó. Mới baseline và một vài trick brute force nho nhỏ mà đã perfect score, một cuộc thi thật kì lạ :))

Và lúc đó team mình cũng bắt đầu mơ về cái top 1 không xa, nghĩ làm thế ếu nào mà nó lại dễ đến thế. Nhưng cuộc vui cũng đến lúc tàn, những tuần sau là khó khăn xuất hiện.

Phần 1 này đã hơi dài, mình sẽ kể tiếp phần 2 ở bài tiếp theo :D