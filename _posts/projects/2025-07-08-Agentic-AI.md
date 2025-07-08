---
title: "Agentic AI - Khi con người trao quyền nhiều hơn cho AI"
categories: projects
classes: wide
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
toc_sticky: true
header:
  teaser: "/images/agentic-ai-thumb.jpg"
  overlay_image: "/images/agentic-ai-thumb.jpg"
  overlay_filter: 0.7
  overlay_color: "#005eff"
---

# Agentic AI là gì ?

## Định nghĩa và bối cảnh hiện nay

Agentic AI được định nghĩa theo nhiều cách, nhưng chúng ta có thể hiểu nó như là các mô hình AI được hoạt động theo dạng agent, chúng sẽ hoạt động độc lập và tự động hoá cao từ một vài yêu cầu của con người. Tuỳ vào nhu cầu chúng có thể có các khả năng như về bộ nhớ (memory), khả năng suy lập (reasoning), khả năng lập kế hoạch (planning), ...

Hiện nay sự phát triển của Generative AI, đặc biệt là ứng dụng của các LLM đã tạo nên một làn sóng sử dụng AI ứng dụng vào đời sống nhiều hơn. Nhiều người cho rằng Agentic AI là một mức độ cao hơn của AI, tuy nhiên mình không đồng ý, theo mình nghĩ nó giống như một giai đoạn các mô hình AI bước ra từ phòng lab và tiếp cận với người dùng dễ dàng hơn. Ngoài việc dễ tiếp cận hơn, Agentic AI được người ta đưa thêm một số khả năng như: phân tích, suy luận, lập kế hoạch, đưa ra kế hoạch, ... Chúng sẽ hoạt động độc lập để hoàn thành một mục tiêu mà con người đưa ra.

TODO: Tạo một ảnh minh hoạ về các khả năng của Agentic AI

## Vì sao các mô hình trước đây thất bại ?

Hãy tưởng tượng cách đây khoảng 5-10 năm, việc chúng ta trò chuyện với một con Chatbot như hỏi han, tâm sự, nhờ nó làm toán, viết code quá ít ỏi, thật ra cũng có nhưng ở một mức độ hạn chế. Lúc đó, các mô hình nhiều nhất được áp dụng trong các tác vụ như chăm sóc khách hàng, hoặc hướng dẫn khách hàng theo một kịch bản nhất định, mình nhớ lại những ngày thử mò mẫm một con bot từ RASA hay tạo Diagflow của Google :D

Đối với các mô hình AI trước thời điểm ChatGPT, chúng ta thấy chúng khá cứng nhắc, chưa có đủ linh hoạt để thích nghi các tình huống mới mà con người đặt ra; lấy ví dụ như sự hiểu biết về các common sense hoặc các thông tin về thế giới xunh quanh. Điều này có thể do các nhà nghiên cứu vẫn chưa có một hình mẫu để hấp thu lượng data khổng lồ hơn, có khả năng mở rộng hơn ví dụ như cơ chế Self-Attention trong Transformer - ý tưởng cốt lõi đằng sau các mô hình GPT.

Mình thấy rằng các mô hình trước ChatGPT có hai vấn đề chính:

- Đầu tiên là cốt lõi ở mô hình thiếu sự linh hoạt trong các tác vụ, các mô hình AI nhìn chung hướng tập trung vào một năng lực nhất định, khả năng mở rộng các năng lực hạn chế. Hãy nhớ về những mô hình rule-base hay những mô hình AI hẹp (narrow AI), chúng ta thấy rằng chúng quá cứng nhắc và thiếu linh hoạt để thích nghi với những thay đổi như thế nào.

- Thứ hai, khả năng tương tác với con người chưa được tốt, chúng ta chưa cảm nhận chúng có common sense và suy luận (hoặc là chúng ta nghĩ chúng có thể có). Đấy chính là điều cản trở sự ứng dụng của con người cho các mô hình AI vào các tác vụ.

- Thứ ba, chưa có một paradigm đủ tốt để hấp thụ lượng data khổng lồ từ con người, sau đó chúng ta có thể thiết kế cho mô hình mở rộng ra hàng hoạt các tác vụ và thấu hiểu hành vi của con người.

TODO: Đưa ra các ý tưởng mô tả cho các vấn đề hiện tại

## Đằng sau sự thành công của Agentic AI

