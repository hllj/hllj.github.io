---
title: "Tổng hợp về các kiến trúc CNN kinh điển - Phần 2"
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
  overlay_image: "/images/cnn-introduction.jpeg"
  overlay_filter: 0.7
  overlay_color: "#005eff"
---

# Giới thiệu

Với một số cải tiến cho các mô hình CNN đầu tiên như AlexNet, VGG, ... Dần dần đã có nhiều mô hình CNN mới được phát triển với khả năng học các đặc trưng tốt hơn. Nhưng nhà nghiên cứu đã phát triển các mô hình theo các hướng như mở rộng chiều sâu, chiều rộng của mô hình; tối ưu hóa chi phí tính toán. Trong phần này, mình sẽ giới thiệu một số hướng phát triển với các mô hình như InceptionNet v1-v3, ResNet, MobileNet.

![Meme](/images/meme.jpeg)

# Mô hình InceptionNet v1, v2, v3

## Ý tưởng

Ý tưởng chính được đưa ra của nhóm tác giả GoogleNet (tên chính thức của mô hình trong ILSVRC) là phát triển mô hình không chỉ theo chiều sâu, mà còn là chiều rộng. Thay vì việc chúng ta phải cố định sử dụng một loại kernel size, InceptionNet tạo ra các module sử dụng nhiều Convolution với các loại kernel size khác nhau như 3x3, 5x5, 7x7, sau đó các đặc trưng sẽ được ghép nối với nhau.

![Naive Inception](/images/inception_naive.png)
<div align="center" style="font-style: italic">
Inception Module cơ bản
</div>

Việc này xuất phát từ ý tưởng từ việc học những phần khác nhau của bức ảnh với các vùng có kích thước khác nhau đòi hỏi ta cần có các kernel size chính xác, việc phối hợp nhiều loại kernel size giúp cho vùng nhận thức của mô hình rộng hơn. Tuy nhiên với việc dùng nhiều loại kernel như vậy sẽ làm tăng chi phí tính toán của mô hình, nhóm tác giả đã khắc phục vấn đề này bằng cách áp dụng convolution 1x1 trước khi đưa vào các loại kernel 3x3, 5x5; với mục tiêu làm giảm kích thước channel của feature map, từ đó giảm chi phí tính toán.

![Reduce Dimension Inception](/images/inception_reduce.png)
<div align="center" style="font-style: italic">
Inception Module với Convolution 1x1
</div>

Về **Convolution 1x1**, đây là một phương pháp được lấy ra từ mô hình [Network in Network](https://arxiv.org/pdf/1312.4400.pdf). Vì sao gọi là Network in Network, vì khi tích chập 1 feature map WxHxC với Convolution 1x1 với N filter, tại mỗi vị trí trong WxH vị trí, ta đang tiến hành tạo ra 1 mô hình Perceptron 1 lớp kết hợp C giá trị thành 1 giá trị, và được scale up lại lên N lần tạo ra feature map mới kích thước WxHxN "cô đọng" lại từ WxHxC.

![1x1 Convolution](/images/1x1convolution.png)
## Mô hình Inception v1

![InceptionNet v1](/images/inception.png)
<div align="center" style="font-style: italic">
Mô hình Inceptionv1 với các Inception module
</div>

Một số tóm tắt về mô hình:

- Mô hình bao gồm 22 lớp (nếu kể cả các lớp max-pooling là 27), nhưng thực tế số lớp được tính độc lập với nhau là 100 với các lớp Convolution được kết hợp trong các inception module.

- Module đầu tiên trước khi đưa vào các Inception module là một Stem module với tuần tự 1 convolution 7x7, max pool 3x3, 1 convolution 1x1, 1 convolution 3x3 và max pool 3x3. Mục tiêu của lớp này không được tác giả giải thích, nhưng ta có thể hiểu là nhưng lớp ban đầu với các kernel size lớn và các vùng nhận thức lớn sẽ học tốt cho các đặc trưng cấp thấp như tần số, góc cạnh, ...

- Mô hình sử dụng một lớp Global Average Pooling 7x7 trước khi đưa nó vào các lớp FC. Các lớp FC của mô hình Inception nhìn chung khá ít để giảm các tham số và dồn hết các phần học đặc trưng vào các lớp Convolution.

- Ngoài ra các phiên bản được cập nhật của Inceptionv1 cũng đã thêm vào 2 nhánh phụ Auxiliary Branch (được trích ra từ các lớp khác nhau) đóng góp cho quá trình huấn luyện nhằm giảm thiểu vấn đề vanishing gradient.

- Kết quả khi so sánh với các mô hình trước trong ILSVRC. Mô hình InceptionNetv1 có độ lỗi nhỉnh hơn 0.6% so với VGG.

![InceptionNet v1](/images/inceptionv1_result.png)

## Mô hình Inception v2, v3

Mô hình Inception-v2 được đề cập trong bài báo [Rethinking the Inception Architecture for Computer Vision](https://arxiv.org/pdf/1512.00567.pdf) đưa ra các phương pháp cải tiến cho mô hình v1. Và mô hình Inception-v3 chính là Inception-v2 với việc thêm vào BatchNorm.

Một số chỉnh sửa được đưa ra nhằm cải tiến để tối ưu các inception module:

![Inception V3](/images/inception_v3.png)

- Thay thế convolution 7x7, 5x5 tương ứng thành 3 convolution 3x3 và 2 convolution 3x3, với tác dụng như VGG, giảm số tham số nhưng vẫn giữ nguyên vùng nhận thức 7x7 hay 5x5.

- Biến đổi các convolution thành các Spatial Seperable Convolution để giảm thiểu tham số cho các convolution 3x3, 5x5, 7x7.

![Spatial Seperable Convolution](/images/spatial_seperable_convolution.webp)
<div align="center" style="font-style: italic">
Các convolution nxn sẽ được phân tách thành 2 convolution nx1 và 1xn, tỉ lệ tham số giảm được tương đối lớn từ n^2 -> 2n
</div>

- Các thiết kế cho mạng học nhằm rộng hơn và cân bằng giữa chiều sâu và chiều rộng hơn so với mô hình v1. Ngoài ra, các mô hình sau còn thêm 1 số lớp Batch Normalization nhằm tăng tốc độ huấn luyện.

# ResNet

Đây là một mạng học sâu cùng thời với InceptionNet, nhưng với những ý tưởng khác để phát triển chiều sâu của mạng học.

## Vấn đề với các mạng Neuron

Kể từ khi một VGG ra đời, các mạng học sâu tiếp theo muốn được tăng thêm độ sâu càng nhiều càng tốt với kì vọng kích thước mô hình càng sâu sẽ càng có khả năng học tốt hơn, tuy nhiên sự thay đổi này không làm mạng tốt hơn, thậm chí còn tệ hơn rất nhiều so với những mạng có số lớp ít hơn.

![Degrade problem](/images/degrade_problem_resnet.png)
<div align="center" style="font-style: italic">
Degrade Problem được nhắc tới trong ResNet, khi mô hình sâu hơn bắt đầu hội tụ, sẽ có hiện tượng độ chính xác của mạng bị bão hòa và dần dần giảm.
</div>

Để lý giải cho vấn đề này, tác giả của ResNet lập luận rằng việc ta thêm một số lớp vào một mạng học sâu "ít lớp" hơn, không thể nào làm giảm độ chính xác của mạng mới sau khi thêm được vói một giải pháp rất đơn giản: tái tạo mạng học mới bằng cách copy những lớp từ mạng học sâu "ít lớp" kia và thêm vào nhưng identity mapping. Tác giả chứng tỏ rằng việc tạo ra một mạng lớn hơn chắc chắn phải có "khả năng học" tốt hơn hoặc ít nhất là bằng so với mạng nhỏ hơn nó.

## Skip connection và Residual Learning

Trong bài báo về ResNet, tác giả đưa ra lý giải cho những ván đề vì sao mạng học sâu hơn lại cho kết quả tệ hơn: mô hình quá khó để tối ưu và đạt được điểm tối ưu. Về sau này có một số bài báo khác có đưa ra các lý giải về việc gặp phải vanishing gradient của các mạng học sâu, cũng là một lí do cho việc học thất bại của các mô hình học sâu.


Để giải quyết vấn đề này, tác giả đưa ra một kiến trúc với tên gọi là Residual Network với kĩ thuật skip connection. Những skip connection có nhiệm vụ bỏ qua một vài lớp huấn luyện và kết nối thằng tới output. Kĩ thuật rất đơn giản như sau.

![Residual Block và Skip connection](/images/Residual-Block.png)

Kĩ thuật này thay đổi cách học của mạng học sâu, giả sử gọi hàm mục tiêu của ta cần học là H(x), trước đây ta sẽ dùng các mạng học để học từ x -> H(x). Bây giờ với skip connection, H(x) = F(x) + x, với F(x) là những đặc trưng mạng học được "bổ sung" vào x thay vì trực tiếp tác động vào x. Ta gọi đây là Residual Learning, F(x) là phần "residue" và x là "identity".

## Vì sao kĩ thuật skip connection lại hiêu quả ?

Đầu tiên, việc thay đổi mạng học thành những Residual Block ở trên khiến cho mạng học sâu của ta "dễ học hơn", khi H(x) là một hàm kết hợp giữa 1 identity function I(x) = x và 1 phần "residue" F(x). Giả sử, trong quá trình tối ưu, việc tối ưu hàm F(x) không cải thiện cho hàm mục tiêu H(x) (thậm chí là làm tệ đi), bài toán tối ưu đơn giản sẽ zero out F(x) và vẫn lưu giữ lại H(x) = 0 + I(x), giúp cho mô hình học được các identity mapping và tránh bị hiện tượng degrade như đã nói.

Thứ 2 là vẫn đề về độ phức tạp của mô hình, việc thêm nhiều lớp vào mạng học sâu chắc chắn sẽ khiến cho khả năng học mô hình tăng lên, tuy nhiên không có gì đảm bảo được rằng ta có thể dễ dàng tìm kiếm được optimal solution hơn so với mô hình nhỏ hơn (thường là sẽ khó hơn rất nhiều).

![Function Classes](/images/functionclasses.svg)

Một cách mô hình hóa cho các cấu trúc mạng là thành những lớp không gian mô hình F1, F2, F3 ... với các kích thước F sau sẽ lớn hơn; và hàm chứa optimal solution ta cần là f'.

Với một mô hình F bất kì, ta tạo ra một mô hình lớn hơn là F', nếu $F \not\subseteq F'$, nghĩa là các F' lớn hơn không bao lấy các mô hình nhỏ hơn thì không có gì đảm bảo F' này sẽ tới gần hơn tới optimal solution f', thậm chí có thể tệ hơn nhiều. Vói sự thay đổi của skip connection và Residual Learning, ta có thể chắc rằng các mô hình lớn hơn được vẫn giữ được sự hiệu quả của mô hình nhỏ, và hoàn toàn thực sự có khả năng học "mạnh" hơn.

Một số phân tích thêm về sự hiệu quả của kĩ thuật skip connection trong các mạng học sâu các bạn có thể xem thêm tại đây từ [BKAI](https://bkai.ai/skip-connections-in-dnns/)

## Mô hình ResNet và kết quả thực nghiệm

Các thực nghiệm đầu tiên của ResNet về sự hiệu quả của việc sử dụng skip connection bằng việc so sánh giữa mô hình 34 lớp không có skip connection và 34 lớp có skip connection như sau.

![Plain vs skip connection](/images/ResNet.png)

![Plain vs skip connection](/images/plain_vs_skipconnection_result.png)
<div align="center" style="font-style: italic">
Kết quả độ lỗi khi huấn luyện của mạng Plain-34 và Plain-18 đều không thấp hơn so với ResNet-34 và ResNet-18
</div>

Mô hình ResNet được xây dựng dựa trên 2 module cơ bản là basic block cho các cấu hình mô hình nhỏ như ResNet-18 và ResNet-34; và bottleneck block để xây dựng cho các mô hình sâu hơn như ResNet-50, ResNet-101, ResNet-152.
![Basic Block and Bottleneck Block](/images/basicblock_bottleneckblock.png)
<div align="center" style="font-style: italic">
2 Loại block cơ bản để xây dựng nên các mô hình ResNet
</div>

Nói kĩ hơn về các thành phần cơ bản của ResNet:

- Với basic block là 2 convolution 3x3 nối với nhau cho phần residual learning.

- Với bottleneck block là 3 convolution liên tiếp nhau bao gồm 1 convolution 1x1 để giảm số chiều sâu của đặc trưng, 1 convolution 3x3, 1 convolution 1x1 để tăng số chiều sâu lên đúng với đầu vào ban đầu. Lí do gọi đây là bottleneck (cổ chai) vì kiến trúc này khi đưa vào sẽ làm nhỏ chiều sâu đặc trưng sau đó mới học và tăng lên lại đúng với số chiều ban đầu, tác giả đã tận dụng khả năng thay đổi chiều của các convolution 1x1 để giảm chi phí tính toán cho loại block này.

- Ở các block nếu gặp trường hợp không đúng chiều, tác giả sử dụng các convolution 1x1 để điều chỉnh lại cho skip connection. Và sau mỗi convolution, tác giả đi kèm với 1 lớp batchnorm trước khi đưa vào hàm kích hoạt ReLU.

![Skip connection for bottleneck block](/images/Bottleneck-Blocks-for-ResNet-50-left-identity-shortcut-right-projection-shortcut.png)

Mô hình ResNet được đề xuất đã tạo nên một mô hình cực sâu với 152 lớp, so với VGG-19 hay Inception với 22 lớp. Mọi người có thể tự tham khảo lại source code cho ResNet ở mọi cấu hình [tại đây](https://github.com/pytorch/vision/blob/a9940fe4b2b63bd82a2f853616e00fd0bd112f9a/torchvision/models/resnet.py)

![ResNet architecture](/images/resnet_arch.png)

Kết quả so với các mô hình trong cuộc thi ILSVRC đã vượt trội hơn so với Inception và VGG.
![ResNet Result](/images/resnet_result.png)

# MobileNet
