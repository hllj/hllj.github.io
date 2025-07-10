---
title: "Scaling Laws - công thức chiến thắng đằng sau các mô hình LLM - Phần 1"
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
  teaser: "/images/scaling-laws-gopher.jpg"
  overlay_image: "/images/scaling-laws-gopher.jpg"
  overlay_filter: 0.5
  overlay_color: "#005eff"
---

Huấn luyện LLM chắc chắn là trò chơi của giới siêu giàu, tuy nhiên liệu họ có ngu ngốc tiêu tiền vào một mô hình "siêu to khổng lồ" mà chẳng đoán định nó thế nào ? Câu trả lời là *Không*, sau cả ngàn lần huấn luyện, giới siêu giàu đã chứng tỏ họ biết cách tiêu tiền và đằng sau những LLM như GPT, LLaMA, Gemini đều tồn tại một công thức chiến thắng. Ít nhất là họ tiêu tiền một cách thông minh hơn <(")

# Scaling Laws là gì ?

Scaling Laws là một dạng các công thức thực nghiệm và các nguyên tắc được phân định để biết được khả năng của mô hình khi thay đổi các yếu tố như kích thước mô hình, kích thước tập dữ liệu, và chi phí tính toán hiện có. Giả sử như khi tăng kích thước mô hình thì tập dữ liệu bao nhiêu sẽ phù hợp, yêu câu chi phí tính toán bao nhiêu là tối ưu. Đây là những giả định được thực hiện với những thay đổi về các yếu tố, từ đó tạo nên một quy luật công thức để tạo ra những mô hình lớn hơn.

Với LLM, ta có thể đưa ra các yếu tố để cân nhắc trong công thức gồm:

- Kích thước mô hình (N): thể hiện qua số tham số trong mô hình, ví dụ như GPT-3 có 175 tỷ tham số, LLaMA có 3 tỷ tham số, ... Với hy vọng rằng, những mô hình càng lớn sẽ có khả năng tổng quát tốt hơn, đây là mục tiêu quan trọng nhất.

- Kích thước tập dữ liệu (D): thể hiện qua số lượng token sử dụng để huấn luyện. Tập dữ liệu lớn hơn thể hiện cho việc có khả năng biết được các thông tin tốt hơn, khả năng suy luận tốt hơn, ...

- Chi phí tính toán (C): chi phí để thực hiện quá trình huấn luyện, được thể hiện qua số phép tính số thực (FLOPs/s - Floating Point Operations per second). Người ta sẽ mong muốn chi phí tính toán này sẽ tối ưu cần cho một mô hình với một lượng dữ liệu cho trước.

Lý do tồn tại của các Scaling Laws nhằm giúp các nhà khoa học tránh thử và sai quá nhiều, liệu có cách nào để thử một vài lần huấn luyện (có thể là cả ngàn lần) sẽ giúp họ nắm được trần của mô hình lớn hơn và tài nguyên họ có, liệu khi nào có đủ tài nguyên về dữ liệu, tính toán đủ để giúp mô hình phát huy hết khả năng không ? Đây là quá trình đòi hỏi phân tích và kinh nghiệm của các nhà khoa học để tránh brute force các lần huấn luyện, giúp tạo ra một hệ thống huấn luyện tối ưu hơn, tất định hơn.

# GPT-3 Scaling Laws - khi lớn hơn là tốt hơn