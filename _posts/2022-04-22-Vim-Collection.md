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

# Các mode cơ bản và những command cơ bản

Vim sẽ bao gồm 3 mode cơ bản cho người sử dụng với những chức năng riêng:

## Normal Mode và các command

Đây sẽ là Mode mặc định ngay khi bạn mới vào Vim. Ở trong mode này, công việc của bạn là *di chuyển* để tìm tới vị trí cần chỉnh sửa. 

## Insert Mode

Đây là Mode mà bạn sử dụng để chỉnh sửa các dòng kí tự, chức năng đơn giản, giống như một editor thông thường. Ở  đây mình cũng không cần phải nói quá nhiều về Mode này.

Tuy nhiên hãy nhớ rằng triết lý của Vim tập trung vào việc di chuyển và chỉnh sửa, vậy nên sau khi chỉnh sửa xong ở một vị trí, hãy nhấn <ESC> để quay lại Normal Mode và tiếp tục di chuyển tới nơi cần chỉnh sửa tiếp theo. Đừng bao giờ mất công di chuyển trong Insert Mode, vì nó cực kì tốn thời gian.

## Visual Mode và các command

Đây là Mode nơi bạn sẽ chọn những dòng, những chữ để di chuyển, chỉnh sửa; nhìn chung nó mô phỏng lại cách bạn sẽ dùng chuột rê vào từng vùng, bôi đen chúng rồi copy paste, ...


# Command nâng cao

Ở đây mình sẽ đưa ra các command nâng cao hơn, bao gồm các tập hợp các thao tác phục vụ cho các mục đích cụ thể, ví dụ như: Tìm kiếm, Thay đổi, Di chuyển và tìm kiếm, Comment code, Các cách di chuyển nâng cao.

# Cài đặt thêm các plugin hỗ trợ, thay đổi theme màu mè

Cách để cài đặt các Plugin hỗ trợ cho Vim tốt nhất là sử dụng Vim Plug. Các bạn có thể cài đặt thông qua repo github này: https://github.com/junegunn/vim-plug

Một số plugin Vim mà mình thấy rất tiện cho công việc, và đáp ứng nhiều nhu cầu để chúng ta "tái thiết" Vim thành một Editor hoàn hảo hơn:

- Nerdtree: Plugin để quản lý thư mục.

- Lightline: Màu mè một chút cho thanh line hiển thị của Vim.

- Vim Multiple cursor: Chỉnh sửa với nhiều cursor cho Vim.

- Vim Surrond: Chỉnh sửa các dạng ngoặc dễ dàng hơn.

# Học cách sử dụng Vim *hằng ngày*

Theo mình các tốt nhất để cải thiện khả năng sử dụng Vim: là sử dụng hằng ngày và luôn tìm hiểu những thứ mới nhằm tối ưu bản thân.

Learning Path của Vim:

- Bật vimtutor, hoàn thành 7 bài tập cơ bản của nó.

- Sử dụng Vim hằng ngày.

- Học cách config cho Vim, học những Trick mới hằng ngày, ghi vào sổ học.

- Tìm những cao thủ sử dụng Vim, học theo những trick của họ. Bạn có thể tham khảo: https://github.com/omerxx/vim-notebook/ Một repo tổng hợp rất nhiều command hay. Hoặc là đọc các post trong https://vim.fandom.com/wiki/Vim_Tips_Wiki

# Tổng kết
