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

Với một số cải tiến cho các mô hình CNN đầu tiên như AlexNet, VGG, ... Dần dần đã có nhiều mô hình CNN mới được phát triển với khả năng học các đặc trưng tốt hơn. Nhưng nhà nghiên cứu đã phát triển các mô hình theo các hướng nhưmở rộng chiều sâu, chiều rộng của mô hình; tối ưu hóa chi phí tính toán. Trong phần này, mình sẽ giới thiệu một số hướng phát triển với các mô hình như InceptionNet v1-v3, ResNet, MobileNet.

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
## Mô hình InceptionNet v1

# ResNet

# MobileNet
