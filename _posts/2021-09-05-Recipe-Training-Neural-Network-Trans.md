---
title: "Công thức để huấn luyện mạng neuron  (A Recipe for Training Neural Networks)"
classes: wide
categories:
  - deep learning
tags:
  - vietnamese
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
toc_sticky: true
header:
  overlay_image: "/images/a_recipe_for_training_nn.jpg"
  overlay_filter: 0.7
  overlay_color: "#005eff"
---

Đây là bài dịch của mình về một blog post của Andrej Karpathy hướng dẫn các kinh nghiệm để huấn luyện một mạng học sâu (các bạn có thể đọc bài gốc tại [A Recipe for Training Neural Networks](https://karpathy.github.io/2019/04/25/recipe/), hiện tại là AI Director tại Tesla và Autopilot Vision.

Tiếp theo đây mình sẽ viết dưới giọng văn của Andrej và các nội dung được giữ nguyên, và một số chú thích của Người Dịch (ND).

# Mở đầu:

Một vài tuần trước, tôi đã post một tweet về "những sai lầm thường mắc phải của các mạng neuron", và liệt kê một vài vấn đề thường gặp khi huấn luyện các mạng. Tweet đó đã gây ra một số lượng bàn luận nhiều hơn mà tôi tưởng tượng (kể cả một webinar :)). Cụ thể hơn, với nhiều người, cá nhân họ đã từng đối mặt với một khoảng cách lớn giữa chuyện "à đây là cách một mạng tích chập hoạt động" và "mạng tích chập chúng ta đạt được SOTA" (ND: Nôm na tác giả nói rằng nhiều người hiểu được mạng CNN hoạt động, nhưng không thể nào giúp nó trở nên tốt hơn, thậm chí là đạt SOTA).


Vậy nên tôi nghĩ rằng đây có thể là cơ hội cho tôi phủi bụi cái blog để mở rộng tweet của với nội dung dài hơn như nó xứng đáng. Tuy nhiên, thay vì đi vào nêu ra nhiều hơn những lỗi thường gặp hay mổ xẻ chúng, tôi muốn đào sâu hơn và nói về cách một người có thể tránh mắc những lỗi đó cùng nhau (hoặc là sửa chúng nhanh). Mẹo ở đây là làm theo một quy trình nào đó, mà theo như tôi nói là không được viết doc 1 cách cụ thể (ND: Ý tác giả đây là những kinh nghiệm nhưng chưa được kiểm chứng cụ thể). Rồi hãy bắt đầu với 2 quan sát rất qun trọng.

## Huấn luyện một mạng neuron là một sự trừu tượng không rõ ràng (Neural net training is a leaky abstraction)

  Rất dễ để bắt đầu huấn luyện một mạng neuron. Hằng hà các thư viện, framework tự hào đưa ra khoảng 30 dòng code tóm tắt thần kì để giải quyết bài toán của chúng ta, và cho ta một một ấn tượng (sai lầm) rằng mọi việc giống như cắm vào và chạy được (ND: plug and play). Một kiểu thường thấy nhất là:

  ```python
  >>> your_data = # plug your awesome dataset here
  >>> model = SuperCrossValidator(SuperDuper.fit, your_data, ResNet50, SGDOptimizer)
  # conquer world here
  ```

  Những thư viện và ví dụ này kích hoạt các phần của não bộ quen với những software tiêu chuẩn - những nơi mà chứa những API sạch sẽ và sự trừu trượng thường đạt được. Kiểu như một thư viện request sẽ được thể hiện như này:

  ```python
  >>> r = requests.get('https://api.github.com/user', auth=('user', 'pass'))
  >>> r.status_code
    200
  ```


  Nó cũng tuyệt! Một lập trình viên dũng cảm đã nhận hết phần việc hiểu về query string, url, GET/POST request, HTTP connection, ... giúp cho bạn và ẩn đi một lượng lớn sự phức tạp phía sau một vài dòng code. Đây là cách chúng ta quen với và luôn kì vọng. Tuy nhiên, với mạng neuron không giống như thế. Chúng không phải là những công nghệ sẵn-sàng-thương-mại (ND: "off-the-shell" technology) ngay khi bạn tách chúng ra khỏi việc huấn luyện 1 bộ phân lớp ImageNet. Tôi đã cố đưa ra quan điểm này trong post ["Yes you should understand backprop"](https://karpathy.medium.com/yes-you-should-understand-backprop-e2f06eab496b) bằng cách bóc tách backpropagation và gọi nó là "một sự trừu tượng không rõ ràng", nhưng tình hình là nó còn khủng khiếp hơn. Backprop + SGD không phải một cách thần kì giúp mạng neuron của bạn hoạt động. BatchNorm cũng không một cách thần kì giúp nó (ND: mạng neuron) hội tụ nhanh hơn. RNN cũng không thần kì cho phép bạn "cắm vào" text không đâu. Và không phải vì bạn có thể công thức hóa bài toán của mình như một mô hình Reinforcement Learing (ND: RL - Học tăng cường) có nghĩa là bạn nên làm. Nếu bạn khăng khăng rằng bạn có thể sử dụng công nghệ mà không hiểu chúng hoạt động, nhiều khả năng bạn sẽ thất bại. Điều này dẫn tôi đến ...

## Huấn luyện mạng neuron thất bại một cách âm thầm (Neural net training fails silently)


Khi bạn phá hỏng hay tinh chỉnh code bạn sai, bạn sẽ thường gặp một số kiểu như ngoại lệ (exception). Bạn đưa vào một số nguyên trong khi code cần là một string. Hàm này chỉ cho phép 3 tham số. Import này không thành công. Key này không tồn tại. Số lượng phần tử trong 2 mảng không bằng nhau. Thêm vào đó, nó thường có thể tạo ra unit test cho các hàm cố định.


Đây chỉ là bước khởi đầu khi bước tới việc huấn luyện. Mọi thứ có thể đúng cú pháp, nhưng tất cả chúng không được sắp xếp 1 cách hợp lý, ... cũng khó để nói. Những "lỗi có thể có trên bề mặt" là rất lớn, logic (khác với cú pháp) rất khó để unit test. Ví dụ, có thể bạn quên lật lại các nhãn khi bạn lật trái - phải bức ảnh khi tăng cường dữ liệu. Mạng của bạn vẫn có thể (một cách hơi shock) vẫn họat động tốt vì mạng của bạn vẫn tự học cách nhận diện ảnh đã bị lật và nhãn của nó. Hoặc mô hình tự động hồi quy (autoregressive) một cách tình cờ học một thứ đáng lý ra là nó phải được dự đoán vì một bug nhỏ (ND: Ý tác giả có thể là chúng ta mặc dù vẫn tạo ra bug trong quá trình huấn luyện, nhưng mạng vẫn có thể học). Hoặc bạn thay vì cố cắt bớt gradient lại cắt bớt giá trị lỗi, làm các mẫu ngoại lai bị bỏ qua trong quá trình huấn luyện. Hoặc là bạn khởi tạo tham số mô hình từ một checkpoint không sử dụng giá trị mean ban đầu của chúng. Hoặc bạn chỉ là làm rối tung hết việc tinh chỉnh regularization, learning rate, tham số ăn mòn của nó (decay rate), kích thước mô hình, ... Vậy việc tinh chỉnh sai của bạn chỉ trả về các ngoại lệ khi bạn may mắn; trong nhiều lần chúng vẫn sẽ huấn luyện nhưng dần dần làm tệ đi.


Như là một hệ quả, (và nó rất khó để nhấn mạnh) một hướng tiếp cận "quá nhanh quá nguy hiểm" để huấn luyện một mạng neuron không hiệu quả và chỉ dẫn tới những nỗi đau. Và bây giờ, đau khổ là một phần tuyệt vời tự nhiên để mạng hoạt động tốt, nhưng nó có thể giảm nhẹ bằng cách trở nên kĩ lưỡng, cẩn thận, đa nghi, và ám ảnh với những viễn cảnh có thể xảy ra. Phẩm chất mà kinh nghiệm của tôi đúc rút liên quan chặt chẽ tới những thành coong trong học sâu đó là kiên nhẫn và chú ý tới chi tiết.

# Công thức


Từ hướng đi của 2 fact trên, tôi đã phát triển một quy trình cụ thể cho bản thân mà tôi đã làm theo khi áp dụng cho một mạng neuron cho một bài toán mới, mà tôi sẽ cố gắng mô tả. Bạn sẽ thấy rằng nó tuân theo 2 nguyên tắc trên rất chặt chẽ. Cụ thể, quy trình sẽ xây dựng từ đơn giản đến phức tạp và tại mỗi bước, tôi sẽ tạo ra một giả thuyết cụ thể về những/ gì nó sẽ xảy ra và tiếp theo hoặc kiểm thử nó hay quan sát cho tới khi chúng ta tìm ra những vấn đề. Điều chúng ta sẽ cực kì tránh đó là đưa ra một đống phức tạp "chưa kiểm chứng", điều mà sẽ giới hạn chúng ta đưa ra các bugs/ cấu hình sai mà sẽ làm chúng ta tìm kiếm (có thể) mãi mãi. Nếu việc viết một code mạng neuron giống như huấn luyện chúng, bạn sẽ cần một learning rate nhỏ và đoán, tiếp theo đánh giá trên toàn bộ tập test sau mỗi bước. (ND: Ý tác giả chúng ta nên bắt đầu từ những thứ cơ bản, thử từng cái đơn giản thay vì một lần đem vào một đống thứ và không thể biêt hướng đi nào cải tiến tiếp)


## Bước 1: Hãy hiểu rõ dữ liệu (Become one with the data)


Bước đầu tiên để huấn luyện một mạng neuron đó là đừng đụng vào bất kì dòng code về mạng, thay vào đó bắt đầu xem xét kĩ dữ liệu của bạn. Đây là bước cực kì quan trọng. Tôi thích dành nhiều thời gian quý báu của mình (tính bằng đơn vị giờ) vào việc lướt qua hàng ngàn mẫu, hiểu rõ phân bố của chúng và tìm kiếm những hình mẫu (pattern). Một cách may mắn, não của bạn sẽ cực kì tốt về việc này. Một lần tôi đã nhân ra rằng dữ liệu tôi chứa nhiều mẫu học lặp. Một lần khác tooi thấy được một cặp ảnh / nhãn tệ hại. Tôi cố tìm kiếm sự mất cân bằng của data và những bias. Tôi cũng sẽ chú ý vào cách bản thân phân lớp dữ liệu, những dấu hiệu ở những kiến trúc mà tôi cuối cùng tìm ra. Ví dụ, liệu những đặc trưng cục bộ là đủ hay chúng ta cần ngữ cảnh toàn cục ? Có bao nhiêu biến thể và những dạng chúng có là gì ? Những biến thể nào là giả, có thể được tiền xử lí chúng ra không ? Liệu vị trí trong không gian có quan trọng hay chúng ta sẽ trung bình gộp nó ra (average pool it out) ? Những chi tiết ảnh hưởng thế nào và chúng ta có thể cố gắng downsample chúng được tới mức nào ? Các nhãn nó bị nhiễu ra sao ?


Thêm vào đó, vì các mạng là một phiên bản rút gọn một cách hiệu quả của bộ dữ liệu của bạn, bạn sẽ cần phải nhìn vào những dự đoán đúng / sai của mạng và hiểu lí do có thể đến từ đâu. Và nếu mạng đang đưa ra những dự đoán có vẻ không vững chắc với những gì bạn thấy trong dữ liệu, có gì đó đã không ổn rồi.


Một khi bạn đã có một cảm nhận định tính, nó cũng sẽ là một ý tốt để về ra những dòng code cơ bản để tìm kiếm / lọc / sắp xếp bất kì thứ gì bạn nghĩ tới (ví dụ kiểu nhãn, kích thước annotation, số lượng annotation, ...) và trực quan sự phân bố và những ngoại lai. Phần tử ngoại lai đặc biệt luôn luôn lộ ra những bug trong việc đánh giá chất lượng dữ liệu hay tiền xử lí.

## Bước 2: Thiết lập khung huấn luyện / đánh giá từ đầu đến cuối + Tạo baseline (Set up the end-to-end training/evaluation skeleton + get dumb baselines)


Bây giờ, khi chúng ta đã hiểu dữ liệu, liệu chúng ta có thể bắt đầu bằng các mạng siêu đỉnh như Multi-scale ASPP FPN ResNet và bắt đầu huấn luyện mô hình ? Dĩ nhiên là **không**. Đó là con đường của sự đau khổ. Bước tiếp theo đó là cài đặt một khung sườn đầy đủ cho huấn luyện và đánh giá, hãy lấy thêm tin tưởng vào sư chính xác của nó qua một chuỗi các thử nghiệm. Ở giai đoạn này, sẽ tuyệt vời nhất là chọn một vài mô hình đơn giản mà bạn không thể nào phá hỏng nó - ví dụ như linear classifier, hoặc là một mạng CNN nhỏ. Chúng ta sẽ muốn huấn luyện nó, trực quan giá trị lỗi, và những độ đo khác (ví dụ độ chính xác - accuracy), các dự đoán của mô hình, và thể hiện trên 1 chuỗi các thử nghiệm cắt bỏ (ablation experiment) với các giả thuyết kèm theo.

**Một vài tip và trick cho giai đoạn này**:

  + **Cố định random seed**. Luôn cố định random seed để chắc chắn rằng nếu chạy lần thứ 2 thì kết quả vẫn như cũ. Nó sẽ loại bỏ nhân tố biến thiên và giúp cho bạn tỉnh táo.

  + **Đơn giản hóa**. Hãy chắc rằng loại bỏ những phần hào nhoáng không cần thiết. Ví dụ, chắc chắn việc tắt tất cả việc tăng cường dữ liệu (Data augmentation) ở bước này. Tăng cường dữ liệu chỉ là một chiến lược regularization mà chúng ta sẽ sử dụng sau này, nhưng bây giờ, nó chỉ là cơ hội để chúng ta gặp phải các bug ngu ngốc.

  + **Thêm những giá trị có ý nghĩa trong lúc đánh giá**. Khi vẽ ra test loss khi chạy đánh giá trên toàn bộ tập test lớn, đừng chỉ đưa ra mỗi test loss qua từng batch, và dựa vào việc làm trơn đồ thị trên Tensorboard. Chúng ta đang theo đuổi sự chính xác và sẵn sàng bỏ thời gian cho quyết định đúng đắn. (ND: Đưa ra thêm thông tin về các metrics, hoặc visualization cho chúng, thêm thông tin khi đánh giá, có thể ý tác giả vậy)

  + **Xác định đúng hàm lỗi ban đầu**. Xác định hàm lỗi của bạn bắt đầu ở đúng giá trị lỗi. Ví dụ, nếu bạn khởi tạo lớp cuối cùng chính xác với giá trị đo được là -log(1/n_classes) với softmax ở bước khởi tạo. Giá trị mặc định cũng có thể được tìm thấy từ L2 Regression, Huber Loss, ...

  + **Khởi tạo tốt**. Khởi tạo lớp cuối cùng có trọng số thật chính xác. Ví dụ nếu bạn đang làm hồi quy một vài giá trị có trung bình là 50 thì nên khởi tạo giá trị bias cuối cùng là 50. Nếu bạn có một dataset bị mất cân bằng với tỉ lệ 1:10 cho positive:negative, đặt bias của logits sao cho mạng của bạn dự đoán xác suất 0.1 ở bước khởi tạo. Thiết lập đúng sẽ tăng tốc hội tụ và loại bổ những chỗ cong hàm lỗi "hóc hiểm" nơi mà trong vài iteration đầu mạng của bạn cơ bản sẽ học vào.

  + **Tạo baseline cho con người (human baseline)**. Quan sát độ đo thay vì độ lỗi, thứ mà con người có thể hiểu được và có thể kiểm tra được (ví dụ accuracy). Bất cứ lúc nào có thể tự đánh giá độ chính xác bằng bản thân (con người) và so sánh với nó (ND: Tự mình đánh giá trên tập test xem được bao nhiêu và so với mô hình). Một cách lựa chọn khác, đánh nhãn dữ liệu test 2 lần, 1 lần coi như là dự đoán của bản thân, 1 lần coi như là ground-truth.

  + **Tạo baseline với đầu vào độc lập (input-independent baseline)**. Huấn luyện một mô hình baseline với đầu vào độc lập (ví dụ đơn giản nhất là đặt tất cả input đều bằng 0). Mô hình này liệu có tốt hơn mô hình khi bạn có dữ liệu huấn luyện không. Có hay không, liệu mô hình của bạn có trích rút được thông tin gì từ đầu vào hay không? (ND: Mình hiểu ở đây là tạo 1 mô hình baseline, có thể là mô hình random hoàn toàn ngẫu nhiên, rồi so sánh với mô hình huấn luyện, liệu mô hình mình thực sự học được hay cũng chỉ đoán ngẫu nhiên).

  + **Overfit một batch** Overfit một batch đơn lẻ với một vài mẫu (ví dụ nhỏ như là 2). Làm như vậy, chúng ta khả năng của mô hình (thêm lớp, thêm filter) và xác nhận rằng chúng ta có thể đạt đến mức loss thấp nhất (ví dụ như 0). Tôi cũng thích trực quan hóa trên đồ thị cả nhãn và giá trị dự đoán và chắc chắn rằng chúng kết thúc điều chỉnh ngang hàng một cách hoàn hảo cho tới khi chúng ta đạt được minimumm loss. Nếu chúng không thể, có một bug ở đâu đó và chúng ta không thể qua bước tiếp theo. (ND: Nói thật là mình cũng chưa làm này bao giờ :( )

  + **Xác nhận độ lỗi khi huấn luyện giảm dần** Ở giai đoạn này, bạn sẽ hi vọng bị underfit trên tập huấn luyện của bạn, vì bạn chỉ dùng một mô hình nhỏ thôi. Thử tăng độ phức tạp của mô hình lên một chút. Liệu độ lỗi huấn luyện của bạn có giảm như nó phải nên vậy ?

  + **Trực quan hóa ngay trước khi đưa vào mạng** Vị trí chính xác đáng nghi ngờ nhất để quan sát dữ liệu của bạn là ngay trước khi đưa vào mô hình học $yhat = model(x)$ hay sess.run trong TF. Bạn sẽ muốn trực quan hóa chính xác những gì đi vào mô hình, thử decode những tensor data và label ra xem. Đây là "nguồn tin cậy" duy nhất. Tôi không thể đếm bao nhiêu lần nó đã cứu tôi và nhận ra vấn đề trong việc tiền xử lí và tăng cường dữ liệu.

  + **Quan sát sự thay đổi của các dự đoán**. Tôi thích quan sát những dự đoán của mô hình trên một tập test cố định trong suốt quá trình training. Cách "thay đổi" những dự đoán như thế nào cho tôi một trực giác tốt về quá trình huấn luyện. Nhiều lần có thể rất khó khăn cho mạng học có thể fit dữ liệu, nếu nó "lắc lư" quá nhiều bằng nhiều cách, tôi có thể nhân ra sự thiếu ổn định. Một learning rate rất cao hay thấp cũng dễ nhận ra trong quá trình "lắc lư" như này. (ND: Kinh nghiệm cá nhân khi train GAN, nếu mô hình thay đổi cách generate example quá nhiều, quá nhanh, khả năng là learning rate đang bị quá cao)

  + **Sử dụng backprop với đồ thị phụ thuộc (chart dependencies)** Code deep learning của bạn sẽ thường chứa nhiều phép tính phức tạp, vectorized, broadcast. Một lỗi mà tôi thường gặp vài lần là người ta thường hiểu sao (ví dụ dùng view thay vì transpose/permute đâu đó trong pytorch) và vô tình làm lẫn các thông tin qua các batch. Có một sự thật đáng buồn là mạng của bạn vẫn sẽ huấn luyện ổn, nhưng nó sẽ học cách bỏ qua dữ liệu từ những mẫu này qua mẫu khác. Một cách để debug cái này (hoặc là những vấn đề tương tự) là đặt độ lỗi thành một cái gì đó bình thường như tổng tất cả các output với mẫu học i, chạy backprop tới tất cả các input và chắc chắn rằng bạn có được gradient khác không chỉ trên mẫu thứ i. Một vài chiến lược có thể sử dụng ví dụ như đảm bảo rằng mô hình autoregression ở thời điể thứ t chỉ phụ thuộc vào 1..t-1. Tổng quát hơn, gradient chỉ cho bạn thông tin phụ thuộc vào những gì bạn đưa mạng, nó có thể hữu ích cho việc debug. (ND: Chưa thử bao giờ :( )

  + **Tổng quát hóa cho các trường hợp đặc biệt** Một chút tip cho sự tổng quát của code, tôi từng thấy nhiều người tạo ra bug khi họ tự làm khó mình bằng cách cố gắng quá nhiều viết một đoạn code khá chung chung. Tôi thích viết một hàm cụ thể và làm thứ tôi muốn ngay tức thì, vào việc luôn, và sau đó sẽ cố làm nó tổng quát hơn sau khi chắc chắn là trả về cùng một kết quả. Thường cái này được áp dụng khi viết vectorized, tôi thường chỉ viết ra một đoạn code vòng lặp trước và sau đó chuyển nó về vectorized code sau.

## Bước 3: Overfit

Ở bước này, chúng ta đã có một hiểu biết về dữ liệu và có một pipeline huấn luyện + đánh giá hoạt động được. Với bất kì mô hình nào chúng ta có thể (có thể hiện thực lại) tính ra được một độ đo mà chúng ta tin tưởng. chúng ta cũng nên có trong tay một mô hình vượt qua các mô hình baseline đơn giản (như baseline với input-dependent, chúng ta nên là vượt qua mô hình baseline này), và chúng ta đã có một vài nhận biết thô về baseline cho con người (chúng ta hi vọng đạt tới). Quá trình bây giờ là lặp lại cho việc liên tục huấn luyện ra 1 mô hình tốt.

**Hướng tiếp cận** tôi thích để tìm ra một mô hình tốt bao gồm 2 giai đoạn: đầu tiên lấy một mô hình đủ lớn mà nó có thể overfit (ví dụ tập trung nhìn vào training loss) và rồi regularize nó thích hợp (giảm bớt một vài training loss để cải thiện validation loss). Lí do tôi thích 2 bước này là neus tôi không thể đạt tới mức lỗi thấp với bất kì mô hình nào, điều này cũng có thể chỉ ra ta đang mắc phải những vấn đề, lỗi, hoặc tinh chỉnh sai sót.

**Một vài tip và trick cho giai đoạn này**:

  + **Chọn mô hình**. Để đạt được một training loss tốt bạn sẽ muốn chọn một kiến trúc phù hợp với dữ liệu. Nó dẫn tới lời khuyên #1: **Đừng cố làm anh hùng**. Tôi đã thấy nhiều người rất háo hức tới độ điên khùng và sáng tạo stack liên tục các khối lego trong hộp toolbox của mạng neuron với rất nhiều kiến trúc kì quặc mà họ nghĩ là khả thi. Hãy kiềm chế sự cám dỗ này lại trong bước đầu của dự án, tôi luôn khuyên mọi người hãy đơn giản hóa, tìm paper liên quan nhất và copy paste kiến trúc đơn giản nhất của họ mà có thể đạt được performace tốt. Ví dụ, bạn đang làm phân loại ảnh, đừng làm anh hùng, hãy chỉ copy và paste kiến trúc ResNet-50 trước. Bạn có thể thêm thắt gì vào đó và vượt qua nó.

  + **Adam là an toàn**. Trong những giai đoạn đầu của setup baseline, tôi thích sử dụng Adam với learning rate 3e-4. Với kinh nghiệm của mình, Adam có thể dễ dàng bỏ qua những hyperparameter, bao gồm cả một learning rate tệ. Với các mạng CNN, SGD được tune tốt sẽ nhỉnh hơn 1 chút so với Adam, những với vùng tối ưu nhất cho learning rate thì rất là hẹp và tùy vào bài toán cụ thể. (Note: Nếu bạn sử dụng RNN và các bài toán chuỗi -sequence model, thường mọi người sẽ dùng Adam nhiều hơn. Ở những bước đầu của dự án, một lần nữa, đừng cố làm anh hùng và theo những gì mà paper lien quan đưa ra)

  + **Phức tạp hóa một thứ trong một thời điểm**. Nếu bạn có nhiều thứ muốn đưa vào cho bộ phân loại của bạn, tôi sẽ khuyên bạn đưa chúng vào từng cái một, và mỗi lần chắc chắn rằng bạn có được sự cải thiện performance như bạn mong muốn. Đừng vứt hết mọi thứ vào ngay lúc đầu. Có nhiều cách để đẩy độ phức tạp lên. Ví dụ, bạn có thể thử cho vào những ảnh nhỏ trước, sau đó đưa những ảnh to sau, ...

  + **Đừng tin vào learning rate decay mặc định**. Nếu bạn muốn sử dụng lại code từ một domain khác, luôn cẩn thận với learning rate decay. Bạn không chỉ muốn sử dụng một decay schedule cho các bài toán khác nhau, nhưng tệ hơn trong một cách hiện thực decay schedule sẽ dựa trên số lượng epoch hiện tại, nó sẽ thay đổi rất lớn dựa trên bộ dữ liệu của bạn. Ví dụ ImageNet sẽ decay đi 10 lần mỗi 30 epoch. Nếu bạn không huấn luyện trên ImageNet thì bạn sẽ không muốn decay này. Nếu bạn không cẩn thận code của bạn sẽ âm thầm đẩy learning rate xuống 0 quá nhanh, và không cho phép mô hình hội tụ. Trong những dự án, tôi luôn tắt hoàn toàn các learning rate decay (Tôi sử dụng LR hằng số) và tune cái này ở cuối cùng.

## Bước 4: Regularize


Chúng ta bây giờ đã có một mô hình lớn và fit ít nhất tập huấn luyện. Bây giờ là lúc chúng ta regularize và lấy thêm độ chính xác cho tập validation bằng cách giảm bớt một số độ chính xác từ huấn luyện. **Một vài tip và trick**:

  + **Lấy thêm dữ liệu**. Đầu tiên, cách tốt nhất và được khuyến khích nhất để regularize một mô hình trong bất cứ setting thực tế nào là thêm dữ liệu thực tế. Một sai lầm thường tháy là dành quá nhiều thời gian để tận dụng vắt kiệt hết một bộ dữ liệu nhỏ trong khi bạn có thể thu thập thêm dữ liệu. Theo như tôi được biết, tôi tin chắc rằng thu thập thêm dữ liệu là một cách khá đảm bảo để cải thiện performace của một mạng neuron được điều chỉnh tốt. Một cách khác là sử dụng Emsemble (nếu bạn có thể xoay sở được), nhưng cận trên của nó chỉ khoảng ~5 mô hình.

  + **Dữ liệu tăng cường** Điều tốt sau dữ liệu thực tế là dữ liệu giả một nửa, thử một số phương pháp tăng cường dữ liệu ngay lập tức.

  + **Cách tăng cường sáng tạo khác** Nếu dữ liệu giả một nửa không thể làm được, dữ liệu giả hoàn toàn cũng có thể được sử dụng. Người ta cũng đang tìm ra các cách sáng tạo ra dữ liệu để mở rộng. Ví dụ, [domain randomization](https://openai.com/blog/learning-dexterity/), sử dụng [giả lập](http://vladlen.info/publications/playing-data-ground-truth-computer-games/), hoặc là khôn khéo đưa dữ liệu vào các khung cảnh khác nhau, hoặc thậm chí là dùng GAN.

  + **Pretrain** Rất hiếm có vấn đề gì khi sử dụng mạng đã được huấn luyện nếu có thể, thậm chí nếu bạn đã có đủ dữ liệu.

  + **Hãy bám vào supervised learning** Đừng nên quá hào hứng với các mạng được huấn luyện unsupervised learning. Không giống như những post vào năm 2008 nói với bạn, theo tôi được biết, không có phiên bản nào báo cáo có kết quả tốt hơn trong các mô hình thị giác máy tính hiện đại (mặc dù NLP có vẻ đã làm khá tốt với BERT và những người bạn hiện nay)

  + **Thử chiều đầu vào nhỏ hơn**. Loại bỏ đi những đặc trưng mà có thể chứa những tín hiệu giả. Bất kì tín hiệu giả được thêm vào chỉ là cơ hội cho việc overfit nếu dữ liệu của bạn nhỏ. Tương tự với những chi tiết cấp thấp không tác động nhiều, hãy thử một ảnh nhỏ hơn.

  + **Thử một mô hình nhỏ hơn**. Trong nhiều trường hợp, bạn có thể sử dụng các domain knowledge để ràng buộc lại mô hình để làm giảm kích thước của nó. Ví dụ, đã từng một thời việc sử dụng các lớp Fully Connected ở đỉnh các backbone của ImageNet, nhưng bây giờ đã bị thay thế bởi một average pooling đơn giản, đã loại bỏ đi cả đống parameter trong quá trình.

  + **Giảm batch size**. Due to the normalization inside batch norm smaller batch sizes somewhat correspond to stronger regularization. This is because the batch empirical mean/std are more approximate versions of the full mean/std so the scale & offset “wiggles” your batch around more. (ND: Mình chưa hiểu rõ vấn đề này lắm nên sẽ không dịch).

  + **Sử dụng Dropout** Thêm Dropout, sử dụng một cách cẩn thận, hạn chế vì có vẻ Dropout **không thích chơi chung** với BatchNorm.

  + **Weight decay**. Tăng mức weight decay cho các tham số học, tăng regularization.

  + **Early Stopping**. Dừng việc học ngay khi mô hình có validation loss có xu hướng overfit.

  + **Thử một mô hình lớn hơn**. Tôi nhắc tới cái này cuối cùng và sau early stopping vì nhiều lần tôi thấy trong quá khứ, một mô hình lớn hơn tất nhiên là sẽ overfit nhiều hơn, nhưng mô hình lúc "early stop" vẫn sẽ tốt hơn mô hình nhỏ hơn nó.


Cuối cùng, để hoàn toàn tự tin vào những thứ bạn thêm vào là một bộ phân loại hợp lý, tôi thích trực quan hóa mô hình với trọng số lớp đầu tiên và chắc chắn rằng nó học ra các cạnh có vẻ khả thi. Nếu lớp đầu tiên của những filter nhìn nhiễu thì đã có cái gì đó không ổn. Tương tự, các hàm kích hoạt đôi khi cũng đưa ra các hình dạng kì lạ và một vài gợi ý cho những vấn đề.

## Bước 5: Tune

Bạn nên bây giờ đã có rất nhiều mô hình với một không gian mô hình lớn và muốn tìm một kiến trúc đạt được validation loss tốt nhất. **Một vài tip và trick cho bước này**:

  + **random grid search**. Tune một lúc nhiều hyperparameter nghe có vẻ rất hấp dẫn bằng việc grid search nhằm bao quát hết tất cả các cách thiết lập, nhưng hãy nhớ trong đầu rằng cách tốt nhất là sử dụng random search (tham khảo [tại đây](https://jmlr.csail.mit.edu/papers/volume13/bergstra12a/bergstra12a.pdf)). Một cách trực giác, bởi vì các mạng neuron thường nhạy cảm với một vài parameter hơn những cái khác. Trong giới hạn, nếu parameter a có nhiều tác động, nhưng thay đổi parameter b không có nhiều ảnh hưởng vậy bạn nên sample parameter a nhiều hơn thay vì cố định tại 1 điểm nhiều lần.

  + **hyper-parameter optimization**. Có một lượng lớn các phương pháp tối ưu hyperparameter bằng Bayesian và một vài người bạn có đưa ra kết quả thành công với chúng, nhưng với kinh nghiệm cá nhân thì hướng tiếp cận tốt nhất để đạt SOTA là tìm ra một không gian mô hình rộng và hyperparameter như là đứa thực tập tìm mà bơi trong đó :) Đùa thôi (ND: Andrej cũng không chắc chắn về cái này :) )


## Bước 6: Tận dụng hết các phần của hệ thống

Một khi bạn đã tìm ra kiến trúc tốt nhất và các hyperparameter, bạn vẫn có thể sử dụng thêm 1 vài trick để tận dụng nốt các phần còn lại của hệ thống:

  + **Ensemble** Model Ensemble khá đảm bảo sẽ tăng ít nhất 2% độ chính xác ở mọi thứ. Nếu bạn không thể xoay sở để thực hiện lúc test, hãy tìm hiểu về knowledge distillation để nén các mô hình lại với [dark knowledge](https://arxiv.org/abs/1503.02531) (ND: Có một kĩ thuật gọi là Knowledge Distillation nhằm chuyển các tri thức học từ một mô hình lớn về một mô hình nhỏ hơn).

  + **Cứ để nó huấn luyện đi**. Tôi đã thấy nhiều người mất kiên nhẫn và muốn dừng việc huấn luyện lại khi mà validation loss có vẻ tăng trở lại. Kinh nghiệm của tôi là cứ để mạng được huấn luyện trong một thời gian dài. Một lần tôi vô tình để quên một mô hình huấn luyện qua cả kì nghỉ mùa đông, khi tôi trở lại vào tháng 1 nó đã đạt SOTA. (ND: LMAO :) ).

# Kết luận

Một khi bạn đã xem đến đây, bạn đã nắm được những công thức cho thành công: Bạn có một hiểu biết sâu về công nghệ, bộ dữ liệu và bài toán, bạn đã thiết lập toàn bộ cơ sở huấn luyện / đánh giá và đạt được độ chính xác cao, bạn cũng đã tăng hiểu biết về những mô hình phức tạp, đạt được những cải thiện trong cách của mình. Bây giờ bạn đã sẵn sàng đọc những paper, thử nhiều thử nghiệm và đạt kết quả SOTA. Chúc may mắn.
