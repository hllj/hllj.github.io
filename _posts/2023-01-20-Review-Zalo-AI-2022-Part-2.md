---
title: "Top 2 Zalo AI Challenge 2022 và một số cảm nhận của bản thân - Phần 2"
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
  teaser: "/images/2022-thumb.jpeg"
  overlay_image: "/images/2022-thumb.jpeg"
  overlay_filter: 0.5
  overlay_color: "#005eff"
---

Trải qua tuần đầu khá thành công, nhưng những tuần sau là ác mộng trong cuộc thi này :) cũng như là cái kết thúc ảo ma của cuộc thi này.

# Bộ dữ liệu test mới
Sau cỡ một tuần đầu, trên bảng xếp hạng có tầm chục team gì đấy đạt score hoàn hảo như tụi mình. Tụi mình đã hiểu là cuộc thi này nó méo dễ ăn tí nào, đầu tiên là không thể nào cải thiện kết quả, vì giờ tụi mình không chắc mô hình train ra mới có bị overfit không, hay nếu như tập dữ liệu Private cũng như này thì khả năng chục team đồng hạng là có, lúc đó phải đem thời gian ra so sánh nữa thì ... hên xui.

Tầm tuần thứ 2 gì đấy, team nhận thông báo mới về bộ dữ liệu Public Test thứ 2, BTC cho rằng các team mạnh quá, đạt điểm cao quá với bộ 1 nên đã cho bộ này để làm khó các thí sinh :))) Mình thì coi đó là lời bào chữa khá tệ, không thể nào nói đỡ được cho cách xây dựng bộ dữ liệu này tệ tới mức nào.

Như mọi khi, mọi thứ đều phải bắt đầu lại từ đầu - Explore Data. Team mình nhận thấy bộ dữ liệu thứ 2 nó chất lượng tệ, tệ ở cả chất lượng ảnh, chất lượng hiển thị kiểu: cứ như bị cắt ngắn đi thời lượng, cắt bớt các phần khung hình hoặc là thay đổi màu đi. Tụi mình đánh giá bộ Public Test 2 này không giống gì Data Train, mà cũng chẳng giống bộ Public 1 luôn :)

![Dữ liệu chất lượng ghê](/images/shift-variance.png)
<div align="center" style="font-style: italic">
Dữ liệu như này thì mọi lí thuyết vứt vào sọt rác :)
</div>

Và tiếp đó là chuỗi ngày loay hoay trên bảng xếp hạng Public Test 2.

# Loay hoay

Team mình đánh giá không thể nào sử dụng tập Validation cũ được, vì nó khác xa so với tập Public Test 2, nên đã quyết định sử dụng trò Augmentation cho tập Validation luôn, cho nó giống với tập Public Test 2. 

Tụi mình vẫn bám với cái baseline đầu tiên, lúc này thay vì sử dụng EfficientNet vì nó fit với data train nhanh quá, team chuyển qua sử dụng Swin Transformer. Nhưng mà finetune trên Swin Transformer đúng là cực hình :) Mình chắc phải trải qua 3-4 ngày thử nghiệm mỗi Learning Rate cho nó, vì đa số các lần thử nghiệm nó đều không học được, **một kinh nghiệm cho Swin Transformer, nó rất kén tham số**. Cuối cùng tụi mình cũng tìm được 1 bộ LR với Weight Decay phù hợp, chi ít là nó bắt đầu học. Lúc này mình còn thử thêm các LR Scheduler khác, có một số đánh giá chủ quan như sau:

- StepLR là một Scheduler để bắt đầu khá ổn, team mình cũng sử dụng xuyên suốt cuộc thi, vì nó khá dễ đoán và dễ hội tụ; nhưng cũng vì vậy mà mình cảm giác cho ra mô hình tổng quát chưa cao bằng.

- Một số loại LR Scheduler như ExponentialLR hay OneCycleLR, mình chưa có đánh giá cụ thể, nhưng cảm giác tuỳ bài toán nếu cảm giác train với ExponentialLR loss không giảm xuống đủ tốt thì nên bỏ, đối với OneCycleLR thì hên xui, cần chọn đúng số Epoch và quan sát coi lúc LR lên tới đỉnh thì nó có overshoot qua cái điểm tối ưu không (Nói chung là xài khá cực).

- Cá nhân mình thấy LR Scheduler mình ưng ý nhất cho bài này là Annealing là: CosineAnnealing hay CosineAnnealingWarmRestarts, mình thường chọn 1 chu kỳ của nó là bằng 1/2 số step của 1 epoch (tức là 1 epoch nó sẽ lên lại một lần rồi xuống từ từ cho tới khi hết epoch), ở đây mình đạt được kết quả tốt nhất cho mô hình training nên đánh giá nó ổn nhất.

Team mình lúc đó có 1 anh khác làm xài chiến lược là Augmentation tập Validation trong lúc training luôn, khá là dị, nhưng lại đạt kết quả cao trên tập Public Test 2, lúc đó chỉ mới mấp mé tầm top 30-40. 

Với cách của mình là Augmentation tập Validation và cố định nó lại (lưu ra ổ đĩa và gộp với tập Val ban đầu) để huấn luyện, mình cảm giác training với cách này thì mô hình đạt kết quả cao ở cả Public Test 1 và 2, Public Test 1 thì chỉ sai cỡ 2-3 case, còn Public Test 2 đạt top 35-40.

Cuối cùng tụi mình thử ensemble mô hình, 2 hướng trên cho ra kết quả tụi mình dừng chân ở top 30 ở bảng xếp hạng Public Test 2. Nói thật tình cũng khá thất vọng.

![](/images/top-30.png)

# Nộp bài và kết quả bảng xếp hạng ảo ma

Thất vọng, nhưng cũng một phần mình khá tin tưởng cuộc thi này nó sẽ overfit nặng, cực nặng vì 2 lí do sau: bộ dữ liệu không đồng nhất,không rõ private test sẽ thiên về Public Test 1 hay 2; và lý do thứ 2, cuộc thi nào mà chả có bất ngờ :)) đến cả Kaggle cũng đống cuộc thi private Leaderboard nhảy cả 500-600 bậc.

Tụi mình nộp thử solution cho bộ Private, BTC thậm chí còn đưa hẳn nguyên Folder các video để cho chạy inference :) Ủa rồi thế nộp Docker làm chi :) sao mấy ông không tự chạy để đảm bảo tính công bằng. Team mình bất ngờ leo thẳng lên vị trí thứ 3 :D Vị trí này thì không có giải gì nhưng mà tụi mình cảm giác có gì đó kì cục lắm.

Những team đạt top cao ở Public Test 2 đều không xuất hiện ở top 3, thậm chí 3 team top 1 ở bảng xếp hạng đó thì chỉ có 1 team vào top 3 ở Private. Tụi mình còn tính thử nộp 1 solution chứa 1 mô hình tốt nhất của mình, thậm chí còn nhảy lên vị trí thứ 2 :) Ảo quá là ảo luôn.

Đến cái lúc này tụi mình bắt đầu đẻ ra văn mẫu kiểu, tụi em "nộp solution trước là nhầm", tính năn nỉ BTC cho mình lấy cái này, nhưng mà tới lúc này thì khoảng tầm 8h tối, còn 3 tiếng trước khi deadline nộp bài, tụi mình lại tụt xuống top 3, một team (top 2 ở bảng Public Test 2) leo lên đầu bảng. Lúc này tụi mình quyết định quay xe theo ý của một anh trong team, lấy cái solution ban đầu :)))) Quyết định không năn nỉ các thứ nữa và được chấp nhận.

# Cái kết bất ngờ

Ngày hôm sau, team mình vẫn giữ được vị trí thứ 3, không có gì thay đổi, vài ngày sau nói chung team cũng chẳng biết mình được vị trí bao nhiêu, ai cũng nghĩ là an bài kết quả rồi. Chắc là trừ mỗi mình ra :)) vì mình từng nghe BTC sẽ chạy lại toàn bộ solution và tính điểm lại nữa, nên vẫn còn hi vọng là tụi nó sẽ liên hệ lại.

Ừ rồi tiếp đó sự việc xảy ra y chang lời mình nói luôn, team mình được một người trong BTC liên hệ lại, nói tụi mình viết rõ cách huấn luyện và kèm một dòng tin nhắn như sau.

![](/images/wow.png)
<div align="center" style="font-style: italic">
Tin chuẩn chưa anh ?
</div>

Không phải nói chứ team mình trở nên điên khùng vì cái này :) Chuẩn bị source code cho đẹp, viết README, làm Slide, chuẩn bị một tâm hồn đẹp để lên nhận cái top 1 với giải thưởng 3k5$ :))))

Mọi thứ đã sẵn sàng, tụi mình còn ghi slide cụ thể các mốc thời gian đã làm, đã thực hiện finetune ra sao, kết quả so sánh như nào, chuẩn như 1 bài báo cáo luận văn tốt nghiệp. Nhưng mà ngay buổi sáng chuẩn bị báo cáo, mình nhận tin ba mình vừa mất ở quê và không thể tham gia, có thể một điềm báo không lành sắp tới ... Mặc dù vậy mọi thứ cũng đã xong xuôi, team mình báo cáo cũng xong với cố vấn BTC và chỉ chờ tới ngày sự kiện trao giải.

Tới hôm trao giải thì tất nhiên mình cũng không đi được và chờ kết quả từ mọi người, team mình lại về vị trí thứ 2, không có một cuộc lên ngôi bất ngờ nào. Theo lời của team thì còn 5 test case cuối cùng tụi mình vẫn đang dẫn team kia, nhưng sau đó thì lại tuột xích. Thôi đành ngậm ngùi top 2.

![Final Standing](/images/final-standing.png)

Team mình chỉ kém team bạn khoảng 0.002, có vẻ như khoảng cách là quá xa để tới top 1 rồi :( So sánh kết quả thì team bạn Ensemble tới 8 model, team mình chỉ ensemble 2, về độ lỗi thì đúng thật team mình thua xa team bạn; điều duy nhất để tụi mình kéo lại kết quả là thời gian inference tụi mình là rất nhanh, nhanh hơn gấp đôi so với team bạn. Tuy vậy kết quả cũng đã có, lại "ngậm ngùi" top 2 thôi.

Dù sao đi chăng nữa, top 2 cũng là một kết quả tốt, team mình đã có nhiều trải nghiệm tuyệt vời cho cuộc thi. Team đã thử những cái mình chưa từng thử, thật sự nghiêm túc cho cuộc thi, cả ngàn thử nghiệm finetune, params search, ... thậm chí còn exploit cả metric để lấy được kết quả cao nhất. Có những lúc team hồ hởi tham gia, có lúc xìu xuống thất vọng vì kết quả, cũng có những lúc như thế, rất thăng trầm luôn. 

Cái kết có thể không thoả mãn tất cả nhưng mà thôi, team mình đã cố gắng, 1k5$ cũng là một thành quả, hi vọng từ đây mỗi người đều phát triển hơn nữa :D

Mình viết những dòng này vào ngày 29 tết, mình sắp về quê, gác lại mọi chuyện trong năm qua và tận hưởng 1 kì nghỉ (hoặc không). Qua cuộc thi này mình tin không có ai là người chiến thắng hay kẻ thua cuộc, mọi người đều đã được học hỏi nhiều thứ. Không có kẻ chiến thắng sau cùng, vì ai cũng đã đạt được một điều gì đó :D

Cảm ơn cả team, nhờ mọi người mình đã lần đầu tiên đạt giải ở một cuộc thi :D