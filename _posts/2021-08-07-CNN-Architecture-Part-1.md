---
title: "Tổng hợp về các kiến trúc CNN kinh điển - Phần 1"
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
  teaser: "/images/cnn-introduction.jpeg"  
  overlay_image: "/images/cnn-introduction.jpeg"
  overlay_filter: 0.7
  overlay_color: "#005eff"
---

# Giới thiệu

Đây sẽ là một bài giới thiệu sơ lược về các kiến trúc CNN kinh điển nhất bắt đầu từ AlexNet năm 2012, tới những mô hình được cải tiến sau này như VGG, ResNet, Inception, MobileNet, ...

![Mô hình CNN qua các năm ở cuộc thi ImageNet Large Scale Visual Recognition Challenge](/images/evolution_cnn.png)

<div align="center" style="font-style: italic">
Mô hình CNN qua các năm ở các cuộc thi ImageNet Large Scale Visual Recognition Challenge
</div>


Nhóm các mô hình này được xây dựng dựa trên các lớp tích chập làm chủ đạo, ban đầu được sử dụng cho các bài toán Phân loại ảnh.
Tới năm 2012, sự xuất hiện và thành công của AlexNet đã làm mọi người chú ý tới hướng đi này, lịch sử của nhóm mô hình này chỉ chưa được 10 năm nhưng đã tạo nên một nhánh riêng cho các mô hình máy học - các mô hình Deep learning.

Tuy vậy, khởi nguồn của các mô hình CNN đã có từ năm 1998 với mô hình CNN đầu tiên của Yann LeCun, mô hình tuy không quá nổi bật nhưng đã đặt ra nền tảng cho sự ra đời sau này ở năm 2012.

Tiếp theo mình sẽ đưa ra sơ lược về các mô hình CNN theo thứ tự thời gian, cũng như các cải tiến của những mô hình sau so với mô hình trước, một số các case study chúng ta có thể áp dụng.

![Sự phát triển qua các năm và các hướng phát triển chính của mô hình CNN](/images/evolution_years.png)
<div align="center" style="font-style: italic">
Sự phát triển qua các năm và các hướng phát triển chính của mô hình CNN
</div>


# Mô hình đầu tiên - LeNet-5

Đây là mô hình do Yann LeCun và cộng sự tạo ra cho bộ dữ liệu MNIST cho chữ số viết tay với kích thước 28x28.

Các mô hình trước đây sử dụng các kiến trúc mạng nơ-ron như sử dụng các Multi-layer Peceptron (mạng nơ-ron truyền thẳng) và cuối cùng đưa vào một lớp softmax để phân loại.

Yann LeCun đã cải tiến và sử dụng thêm các lớp CNN với 2 mục tiêu sau:

-   Lưu giữ các thông tin về mặt không gian sau những lần tích chập, từ đó học ra các đặc trưng cục bộ - local features.
-   Các tham số của các kernel CNN được áp dụng cho toàn bộ ảnh, được gọi là đặc tính Parameter Sharing, với ý nghĩa như đã nêu, từ đó giảm bớt các tham sốnhưng vẫn đảm bảo khả năng học các thông tin từ ảnh.

![Kiến trúc tổng quan của LeNet5](/images/lenet.svg)
<div align="center" style="font-style: italic">
Kiến trúc tổng quan của LeNet-5
</div>

```python
class LeNet(nn.Module):
    def __init__(self):
        super(LeNet, self).__init__()
        self.c1 = nn.Conv2d(in_channels=1, out_channels=6, kernel_size=5)
        self.p1 = nn.AvgPool2d(kernel_size=(2, 2), stride=(2, 2))
        self.c2 = nn.Conv2d(in_channels=6, out_channels=16, kernel_size=5)
        self.p2 = nn.AvgPool2d(kernel_size=(2, 2), stride=(2, 2))

        self.flatten = nn.Flatten()

        self.fc1 = nn.Linear(400, 120)

        self.fc2 = nn.Linear(120, 84)

        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
        x = torch.sigmoid(self.c1(x))
        x = self.p1(x)

        x = torch.sigmoid(self.c2(x))
        x = self.p2(x)

        x = self.flatten(x)
        x = torch.sigmoid(self.fc1(x))
        x = torch.sigmoid(self.fc2(x))
        x = self.fc3(x)

        output = F.log_softmax(x, dim=1)

        return output
```

Một số điểm đáng chú ý ở mô hình LeNet-5 lúc này làm nền tảng cho các mô hình sau như:

1.  Module cơ bản của các lớp CNN là: Một lớp Convolution + một hàm phi tuyến (lúc này LeNet sử dụng hàm sigmoid) + một lớp Pooling (LeNet sử dụng lúc này là một Average Pooling) để học các đặc trưng cục bộ.

2.  Sau khi trải qua 2 Module cơ bản (CNN + Sigmoid + Pooling), các đặc trưng được làm phẳng (Flatten) và đưa qua các lớp Dense (chính là các lớp MLP) còn gọi là các Fully Connected Layer (FC Layer). Mục tiêu là tổng hợp các đặc trưng cục bộ và tiến hành học các đặc trưng toàn cục để phân lớp cuối cùng.

Mọi người có thể đọc thêm về paper LeNet-5 [tại đây](http://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf). Có khá nhiều lý giải của tác giả về lý do lựa chọn kiến trúc này.
Trong bài báo gốc thực tế tác giả không sử dụng các FC Layer ở cuối, mà sử dụng các kết nối các nơ-ron qua các hàm Gaussian RBF, nhưng ta có thể hiểu nó có tác dụng tương tự các FC Layer với kiến trúc MLP.

Tuy nhiên, dù có kết quả trên bộ MNIST khá tốt, nhưng mô hình CNN đầu tiên này vẫn ít nhận được sự chú ý, và với việc có những hạn chế về kĩ thuật lúc đấy nên LeNet-5 vẫn chưa thể vượt qua được các mô hình Machine Learning truyền thống như Support Vectors Machine.

Các mô hình Computer Vision lúc đấy đa phần được tạo ra từ những hand-crafted feature (đặc trưng thủ công) như SIFT, HOG, ... Cách tạo ra các đặc trưng dựa nhiều vào kinh nghiệm của những người làm khoa học, và cách họ phân tích dữ liệu.
Về sau, giới khoa học dần tạo ra một bộ dữ liệu cực lớn và tiến hành kiểm định các mô hình qua các năm, đó là lý do năm 2010 cuộc thi ILSVRC được tạo ra với bộ dữ liệu cực lớn với 14 triệu ảnh và hơn 20000 lớp để phân loại.

![ImageNet](/images/imagenet_banner.jpeg)

Ngoài ra một nhân tố giúp cho các mô hình CNN cất cánh đó chính là các công cụ tính toán, với sự ra đời của các GPU và Nvidia hỗ trợ đã giúp cho các mô hình tận dụng khả năng tính toán song song mạnh mẽ hơn.

# AlexNet

AlexNet là mô hình chiến thắng tại ILSVRC năm 2012, với một khoảng cách độ lỗi giảm rất lớn so với mô hình năm trước từ 25.8 xuống còn 16.4, đó là một kết quả rất khó tin.

## Kiến trúc tổng quan
![Kiến trúc tổng quan của AlexNet](/images/alexnet.png)
<div align="center" style="font-style: italic">
Kiến trúc tổng quan của AlexNet
</div>

```python
class AlexNet(BaseModel):
    def __init__(self, num_of_classes):
        super(AlexNet, self).__init__()
        self.num_of_classes = num_of_classes
        # Layer 1
        self.layer1_conv = nn.Conv2d(
            in_channels=3, out_channels=96, kernel_size=11, stride=4, padding=0
        )
        self.layer1_lrn = nn.LocalResponseNorm(size=5, k=2.0, alpha=1e-4, beta=0.75)
        self.layer1_maxpool = nn.MaxPool2d(kernel_size=3, stride=2, ceil_mode=True)

        # Layer 2
        self.layer2_conv = nn.Conv2d(
            in_channels=96, out_channels=256, kernel_size=5, stride=1, padding=2
        )
        self.layer2_lrn = nn.LocalResponseNorm(size=5, k=2.0, alpha=1e-4, beta=0.75)
        self.layer2_maxpool = nn.MaxPool2d(kernel_size=3, stride=2, ceil_mode=True)

        # Layer 3
        self.layer3_conv = nn.Conv2d(
            in_channels=256, out_channels=384, kernel_size=3, stride=1, padding=1
        )

        # Layer 4
        self.layer4_conv = nn.Conv2d(
            in_channels=384, out_channels=384, kernel_size=3, stride=1, padding=1
        )

        # Layer 5
        self.layer5_conv = nn.Conv2d(
            in_channels=384, out_channels=256, kernel_size=3, stride=1, padding=1
        )
        self.layer5_maxpool = nn.MaxPool2d(kernel_size=3, stride=2, ceil_mode=True)

        self.flatten = nn.Flatten()

        # Layer 6
        self.fc6 = nn.Linear(6 * 6 * 256, 4096)
        self.dropout6 = nn.Dropout(0.5)

        # Layer 7
        self.fc7 = nn.Linear(4096, 4096)
        self.dropout7 = nn.Dropout(0.5)

        # Layer 8
        self.fc8 = nn.Linear(4096, self.num_of_classes)

    def forward(self, x):
        # Layer 1
        x = F.relu(self.layer1_conv(x))
        x = self.layer1_lrn(x)
        x = self.layer1_maxpool(x)

        # Layer 2
        x = F.relu(self.layer2_conv(x))
        x = self.layer2_lrn(x)
        x = self.layer2_maxpool(x)

        # Layer 3
        x = F.relu(self.layer3_conv(x))

        # Layer 4
        x = F.relu(self.layer4_conv(x))

        # Layer 5
        x = F.relu(self.layer5_conv(x))
        x = self.layer5_maxpool(x)

        x = self.flatten(x)

        # Layer 6
        x = self.fc6(x)
        x = self.dropout6(x)

        # Layer 7
        x = self.fc7(x)
        x = self.dropout7(x)

        # Layer 8
        x = self.fc8(x)

        output = F.log_softmax(x, dim=1)
        return output
```

## Một số cải tiến đáng chú ý so với LeNet-5:

Nhìn chung AlexNet sử dụng đúng các nền tảng của LeNet từ năm 1998 với 1 số chỉnh sửa đáng chú ý:

-   Sử dụng tới 5 lớp CNN (so với 2 của LeNet).
-   Thay thế hàm kích hoạt Sigmoid bằng ReLU, đây là cải tiến đáng chú ý vì hàm sigmoid có độ phức tạp tính toán rất lớn so với hàm ReLU, giúp đẩy nhanh quá trình huấn luyện.
-   Sử dụng Max Pooling, Max Pooling được đánh giá hiệu quả hơn trong việc tính toán đạo hàm, cũng như giảm overfiting so với Average Pooling, ngoài ra nó vẫn mang ý nghĩa downsampling, trích rút các thông tin gọn hơn.


Ngoài ra AlexNet còn một vài điểm thay đổi khác:

-   Tận dụng được sức mạnh tính toán của GPU, tuy với bài báo gốc của AlexNet các thức huấn luyện với 2 GPU khác phức tạp và rối rắm.
-   AlexNet có sử dụng 1 số kĩ thuật như Data Augmentation với các phép biến đổi ảnh, sử dụng Dropout nhằm tránh cho mô hình bị overfitting.
-   Ngoài ra một số kĩ thuật khác để chuẩn hóa lại các tín hiệu gọi là Local Response Normalization (LRN), để tăng tốc độ huấn luyện, nhìn chung phương pháp này về sau cũng bị thay thế bởi các phương pháp Normalization khác như BatchNorm hay LayerNorm.

# ZFNet

ZFNet không phải là mô hình vô địch ILSVRC năm 2013, tuy nhiên mô hình vô địch năm đó là Clarifai là một mô hình được phát triển dựa trên ZFNet và cùng chung tác giả với ZFNet.

ZFNet nhìn chung là mô hình kế thừa hoàn toàn lại kiến trúc của AlexNet và đưa ra một số chỉnh sửa. ZFNet còn cung cấp một kĩ thuật gọi là deconvnet nhằm visualize các đặc trưng học được và từ đó đưa ra các nhận xét về AlexNet để cải tiến.

## Kĩ thuật deconvnet cho việc visualization

![Kĩ thuật deconv](/images/deconv_technique.png)

Ta biết rằng các module cơ bản của CNN từ mô hình AlexNet là: Convolution Layer + ReLU + Max Pooling. Kĩ thuật deconvnet sẽ đảo ngược các lớp và thứ tự tính toán đó, sau đó tiến hành và đưa các kết quả lên tương ứng với các pixel, từ đó ta có thể quan sát các giá trị học được và tương tác với vùng điểm ảnh đó.

Các lớp nghịch đảo sau tuy không lấy lại đúng các giá trị chính xác tham số học, nhưng cũng cho ta đánh giá phần nào về kết quả huấn luyện.

1.  UnPooling: Đưa ra các kết quả đảo ngược từ các lớp Max Pooling

![UnPooling](/images/unpooling.jpeg)

2.  Rectification. Hàm kích hoạt là ReLU sẽ giữ các tín hiệu với giá trị dương và các giá trị âm được đưa về 0, với lớp Rectification này chúng ta chỉ có thể tiếp tục áp dụng ReLU 1 lần nữa để lấy các giá trị dương.

3.  Deconvolution: Đây là phép tính nghịch đảo với Convolution và được áp dụng để lấy lại các kết quả trước khi Convolution.

## Visualization một số lớp CNN từ AlexNet

![Layer 1 và 2](/images/zfnet_layer1-2.png)

Với lớp CNN thứ  1 và 2, tác giả ZFNet đưa ra các kết luận là ở 2 lớp này mô hình học được các đặc trưng cấp thấp.
Tuy nhiên ở lớp 2 đang gặp vấn đề là Aliasing Problem, là một vấn đề trong xử lý tín hiệu số khi mà các tần số bị lẫn vào nhau, khó phân biệt được.

Lớp CNN thứ 1 chỉ chứa các tần số cao và thấp, hoàn toàn thiếu đi tần số trung bình.
Lớp CNN thứ 2 bịhiện tượng Aliasing, tác giả đưa ra lý do vì lớp CNN trước sử dụng stride 4 và các tín hiệu bị thưa đi, không còn rõ ràng.

![Layer 3](/images/zfnet-3.png)

Ở lớp CNN thứ 3, các tham số dần học được các pattern như dạng lưới, dạng chữ, biên cạnh.

![Layer 4-5](/images/zfnet-4-5.png)

Ở lớp CNN thứ 4, 5 ta thấy các tham số hình thành đã học được các đặc trưng phức tạp như khuôn mặt chó mèo, hình dáng của các vật thể trong hình ảnh, ...

## Cải tiến so với AlexNet

Từ các visualization từ mô hình AlexNet, tác giả của ZFNet đã đưa ra các cải tiến dựa trên việc chỉnh sửa 1 số hyperparameter như sau:

1.  Giảm kernel size của lớp CNN đầu tiên từ 11x11 thành 7x7. Hình b chính là kết quả cải thiện của ZFNet, ta thấy được các đặc trưng học đã gồm nhiều tín hiệu tần số trung bình, ít các tín hiệu tần số cao hoặc thấp đi.

![ZFNet improve layer 1](/images/zfnet-improve-1.png)

2.  Chỉnh sửa stride của lớp CNN đầu tiên từ 4 thành 2, nhìn chung ta thấy các đặc trưng tín hiệu học được đã mượt hơn, dễ tách biệt hơn.

![ZFNet improve layer 2](/images/zfnet-improve-2.png)

## Mô hình tổng quát

Từ 2 chỉnh sửa nhỏ ở lớp đầu tiên (cũng như 1 số lớp khác), ZFNet đã vượt qua AlexNet. Đạt mức lỗi 16% trên tập validation top-5.

![ZFNet Result](/images/zfnet-result.png)
<div align="center" style="font-style: italic">
Kết quả độ lỗi của ZFNet
</div>

![ZFNet architecture](/images/zfnet-arch.png)
<div align="center" style="font-style: italic">
Mô hình tổng quát của ZFNet
</div>

# VGG

Sau những thành công của AlexNet và sau đó là ZFNet, giới nghiên cứu bị thuyết phục bởi những kết quả ấn tượng từ CNN.
Tuy nhiên các mô hình nhìn chung được chỉnh sửa mang nhiều công đoạn code phức tạp, chưa có một mẫu chung để lựa chọn các tham số cho các lớp như kernel size, stride, padding, ...

VGG ra đời và đã tạo nên một kiểu mẫu tạo ra mô hình mà chúng ta đều có thể áp dụng được dễ dàng và tạo ra các mô hình large scale với hàng triệu tham số.

## Cách chọn kernel size, filter, stride, padding cho Convolution

Thay vì sử dụng một kernel size lớn, VGG chỉ sử dụng các kernel size 3x3 cho tất cả lớp Convolution, với stride 1 và padding 1. Khi đưa qua các lớp convolution này, kích thước ảnh WxH không thay đổi.

Ý tưởng cơ bản của tác giả VGG đưa ra đó là việc sử dụng 3 lớp convolution 3x3 hiệu quả hơn so với sử dụng 1 lớp convolution 7x7 của ZFNet.

Đầu tiên về mặt đặc trưng, 3 lớp 3x3 với các channel lớn sẽ tối đa hóa sự đa dạng các đặc trưng học được hơn vì ta sử dụng tới 3 lần biến đổi phi tuyến. Thứ hai, về số lượng tham số kernel, 1 lớp convolution 7x7 có số tham số $1 \times (7 \times 7) \times C = 49C$, với C là số lượng filter của convolution, đối với 3 lớp convolution 3x3 ta chỉ có $3 \times (3 \times 3) \times C = 27C$, ít hơn hẳn.

## Max Pooling

VGG sử dụng các lớp Convolution để học đặc trưng, và các lớp Max Pooling để downsampling, các lớp Max Pooling có kernel size 2, stride 2. Khi đưa qua lớp Max Pooling này, kích thước của ảnh sẽ giảm đi 1/2.

## Scale up các đặc trưng

Đây là mô hình đầu tiên sử dụng các lớp Convolution liên tiếp nhau trước khi sử dụng Max Pooling, VGG dùng số lượng filter của các lớp Convolution lũy thừa của 2 như 64, 128, 256, 512. Mô hình VGG nhìn chung là một mô hình có số lượng tham số cực lớn với hơn 128 triệu tham số, không gian lưu trữ của mô hình ước tính khoảng trên 600Mb.

## Kiến trúc tổng quan

Từ đây ta thuộc nằm lòng mẫu thiết kế của VGG vì chúng lặp lại nhau, khi đi vào các lớp sâu hơn, kích thước channel sẽ tăng theo lũy thừa 2, và kích thước ảnh sẽ được giảm đi một nửa dần dần.

![VGG với các cấu hình](/images/vgg-arch.jpg)
<div align="center" style="font-style: italic">
Các cấu hình khác nhau của VGG
</div>

![AlexNet vs VGG](/images/alexnet-vgg.png)
<div align="center" style="font-style: italic">
Mô hình tổng quan khi so sánh VGG16 và VGG19 với AlexNet
</div>

## Kết quả và code mẫu

![Kết quả của VGG](/images/vgg-result.jpg)
<div align="center" style="font-style: italic">
Kết quả của mô hình VGG so với các mô hình trước đó
</div>

```python
vgg_arch = {
    "A": [64, "M", 128, "M", 256, 256, "M", 512, 512, "M", 512, 512, "M"],
    "B": [64, 64, "M", 128, 128, "M", 256, 256, "M", 512, 512, "M", 512, 512, "M"],
    "C": [64, 64, "M", 128, 128, "M", 256, 256, "v1", "M", 512, 512, "v1", "M", 512, 512, "v1", "M",],
    "D": [64, 64, "M", 128, 128, "M", 256, 256, 256, "M", 512, 512, 512, "M", 512, 512, 512, "M",],
    "E": [64, 64, "M", 128, 128, "M", 256, 256, 256, 256, "M", 512, 512, 512, 512, "M", 512, 512, 512, 512, "M",],
}

"""
VGG Architecture: 64-128-256-512 stand for filters in convolution layers, "M" stand for Max Pooling, "v1" is a 1x1 convolution using as add-ons for some VGG architectures
"""


class VGG(BaseModel):
    def __init__(self, num_of_classes, arch):
        """
        Create VGG with arch from vgg_arch dictionary
        """
        super(VGG, self).__init__()
        self.num_of_classes = num_of_classes
        self.in_channels = 3
        self.arch = arch
        self.feature = self._create_from_arch(self.in_channels, arch)
        self.classifer = nn.Sequential(
            nn.Flatten(),
            nn.Linear(512 * 7 * 7, 4096),
            nn.ReLU(),
            nn.Linear(4096, 4096),
            nn.ReLU(),
            nn.Linear(4096, self.num_of_classes),
        )

    def forward(self, x):
        feat = self.feature(x)
        logits = self.classifer(feat)
        return logits

    def _create_from_arch(self, in_channels, arch):
        income_channels = in_channels
        conv_layers = []
        print("get here")
        for layer in arch:
            if isinstance(layer, int) is True:
                outcome_channels = layer
                conv_layers += [
                    nn.Conv2d(
                        income_channels,
                        outcome_channels,
                        kernel_size=3,
                        stride=1,
                        padding=1,
                    ),
                    nn.ReLU(),
                ]
                income_channels = outcome_channels
            elif layer == "M":
                conv_layers += [nn.MaxPool2d(kernel_size=2, stride=2)]
            elif layer == "v1":
                conv_layers += [
                    nn.Conv2d(
                        income_channels,
                        income_channels,
                        kernel_size=1,
                        stride=1,
                        padding=0,
                    ),
                    nn.ReLU(),
                ]
        return nn.Sequential(*conv_layers)
```

# Tổng kết cho phần 1

Sau phần 1, chúng ta đã biết qua các mô hình CNN đầu tiên với các nhận xét sau:

1.  Các mô hình CNN với việc gia tăng các lớp Convolution và kích thước mô hình nhìn chung đã thể hiện sức mạnh trong việc học các đặc trưng và thể hiện kết quả đáng kinh ngạc. Với mô hình VGG đã là một mô hình large scale với số lượng tham số cực khủng.

2.  Một số case study chúng ta có thể áp dụng:
    -   Module cơ bản cho các mô hình CNN: Convolution + ReLU + Max Pooling
    -   Sử dụng các phương pháp để giảm overfiting như Dropout, Data Augmentation.
    -   Luôn thiết kế sao cho kích thước đầu vào của feature map giảm dần, kích thước số channel tăng dần.
    -   Các đặc trưng ở những lớp ban đầu là những đặc trưng cấp thấp, càng về sau mô hình học được nhiều đặc trưng cấp cao hơn.

3.  Bây giờ, người ta chủ yếu chỉ còn sử dụng VGG cho 1 số task như Face Recognition, tuy nhiên vẫn còn hạn chế do kích thước mô hình rất lớn. Các mô hình còn lại như AlexNet, ZFNet không còn được sử dụng làm backbone nữa.
