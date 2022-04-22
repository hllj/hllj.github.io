---
title: "Hướng dẫn về Vim, cực kỳ cơ bản"
classes: wide
categories:
  - vim
tags:
  - vietnamese
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
toc_sticky: true
header:
  overlay_image: "/images/vim_thumb.png"
  overlay_filter: 0.7
  overlay_color: "#005eff"
---

# Introduction

Đây sẽ là một bài hướng dẫn các cách sử dụng Vim mình áp dụng vào công việc *hằng ngày* để coding, có thể nó sẽ không đầy đủ nhưng đó tùy thuộc vào khả năng tự học và tìm tòi của các bạn, vì learning curve của Vim sẽ luôn đi lên và cùng hướng với sự tò mò của bạn.

![Vim Learing Curve](/images/vim_learning_curve.png)

Mở đầu cho bài hướng dẫn về Vim, chúng ta nên trả lời câu hỏi, "Vì sao phải sử dụng Vim?", vì ở ngoài kia còn rất nhiều Text Editor xịn xò hơn như VSCode, IntellJ IDEA, Notepad++, Sublime Text, Atom, ... Vim có gì đặc biệt và mọi người có thể áp dụng nó vào những việc gì.

Vi là một trình soạn thảo văn bản mặc định (Text Editor) của các hệ điều hành Linux thời đầu, và Vim - Vi IMproved là một phiên bản nâng cấp của vi, thêm một vài tính năng, và có khả năng thêm các plugin, tăng khả năng tùy chỉnh, tuy vậy Vim vẫn giữ được những triết lý của những lập trình viên đời đầu về một text editor:

-	Kết hợp với Terminal, tối ưu hóa sự chuyển dịch công việc từ Terminal - text editor nhanh chóng. Bộ đôi Terminal - Vim là một cặp đôi được sinh ra để giành cho nhau.

-	Tập trung vào việc editor bao gồm: di chuyển (motion) và chỉnh sửa (edit). Không dùng chuột để click trên màn hình, kéo thả, hay bôi đen; dùng chuột rất chậm :')

Vậy Vim sẽ tốt cho những việc như thế nào, có thể áp dụng vào đâu, liệu bạn có phù hợp với Vim? 

Đầu tiên, bạn chỉ muốn chỉnh sửa trên 1 vài file, từ 1-2 file một lúc *thật nhanh*. 

Tiếp theo, code trên server thông qua SSH, sử dụng Vim với khả năng chỉnh sửa nhanh và chạy command bằng terminal sẽ rất tốt.

Cuối cùng, bạn là một người thích những thứ old school và ngầu lòi :')

![Vim cool](/images/vim_cool.jpeg)

# Cài đặt

Mọi người có thể chọn cài đặt 1 trong 2 loại Vim sau: gVim hoặc NeoVim. Cá nhân mình đánh giá NeoVim tương đối nhiều thứ để vọc hơn, tuy nhiên mình bắt đầu với gVim và cách cài đặt nó cũng nhẹ hơn. Những command hướng dẫn ở dưới đều có thể áp dụng cho cả 2 loại.

Cách cài đặt gVim

```bash
sudo add-apt-repository ppa:jonathonf/vim
sudo apt update
sudo apt install vim
```
