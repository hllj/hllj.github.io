---
title: "[Read with me] Introduction to Probability for Data Science - Chapter 1"
classes: wide
categories:
  - math
  - read
  - probability
tags:
  - vietnamese
  - math
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
toc_sticky: true
header:
  overlay_image: "/images/linear-algebra.jpeg"
  overlay_filter: 0.7
  overlay_color: "#005eff"
---

Đây là sẽ những ghi chép của mình cho việc học, chủ yếu là những phần mình thấy quan trọng, cũng như các bài tập mình làm trong suốt thời gian học.

# Chapter 1: Mathematics Background

## Finite Series

### Geometric Series

Chuỗi hình học là một chuỗi hữu hạn hoặc vô hạn các số, giữa các số cách biệt nhau với một tỉ lệ. Trong các chương sau, chúng ta sẽ sử dụng chuỗi hình học để tính Expectation (Kì vọng), Moments.

Ví dụ:

Một chuỗi hình học với $0 < r < 1$, là một chuỗi hữu hạn các số là luỹ thừa của $r$ là một dãy số như sau: $\{ 1, r, r^2, ..., r^n \}$

Nếu chuỗi này vô hạn thì ta sẽ có: $\{ 1, r, r^2, r^3, ... \}$

**Theorem 1.1**:

$$\sum_{k=0}^{n} r^k = 1 + r + r^2 + ... + r^n = \frac{1-r^{n+1}}{1 - r}~~~~ (1.1)$$ 

Từ theorem 1.1 suy ra:

$$\sum_{k=0}^{\infty} r^k = \frac{1}{1-r}~~~~ (1.2)$$ 

Chứng minh cho (1.2):

$$
\sum_{k=0}^{\infty} r^k = \lim_{n\to\infty} \sum_{k=0}^{n} r^k = \lim_{n\to\infty} \frac{1-r^{n+1}}{1 - r} = \frac{1}{1-r} ~~~~ (1.3)
$$

Vì ta có: $0 < r < 1, \lim_{n\to\infty} r^{n+1} = 0$

Từ theorem 1.1, ta lấy đạo hàm 2 vế ta có:

$$
\sum_{k=1}^{\infty} kr^{k - 1} = \frac{1}{(1-r)^2} ~~~~ (1.4)
$$

Ví dụ bài tập: 
Tính tổng sau:
$$
\sum_{k=1}^{\infty} k \times \frac{1}{3^k}
$$

$$
\sum_{k=1}^{\infty} k \times \frac{1}{3^k} = \sum_{k=1}^{\infty} k \times \frac{1}{3} \times (\frac{1}{3})^{k-1}
$$

$$
= \frac{1}{3} \times \sum_{k=1}^{\infty} k \times (\frac{1}{3})^{k-1} 
$$

$$
= \frac{1}{3} \times \frac{1}{(1-\frac{1}{3})^2} = \frac{3}{4}
$$

### Binomial Series

**Theorem 1.2** 
Với các số thực a, b bất kì, chuỗi nhị thức với bậc n là:

$$
(a+b)^n = \sum_{k=0}^n \binom{n}{k} a^{n-k} b^{k} ~~~~ (1.5)
\\
\binom{n}{k} = \frac{n!}{k!(n-k)!} ~~~~ (1.6)
$$

## Approximation

Chúng ta sẽ sử dụng sự xấp xỉ để chứng minh các định lý giới hạn, cũng như các phân phối ví dụ như phân phối nhị thức, phân phối Poisson.

**Definition** Xấp xỉ Taylor:

Gọi một ánh xạ $f: \mathbb{R} \to \mathbb{R}$ là một hàm liên tục, có đạo hàm liên tục. 

Gọi $a$ là một hằng số cố định. Xấp xỉ Taylor của $f$ tại điểm $x=a$ là:

$$
f(x) = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + ... = \sum_{n=0}^{\infty} \frac{f^{(n)}}{n!}(x-a)^n
$$

Với $f^{(n)}$ là đạo hàm bậc n của hàm $f$

### Exponential Series

**Theorem** Với xlaf một số thực bất kì, ta có:

$$
e^x = 1 + x + \frac{x^2}{2} + \frac{x^3}{3} + ... = \sum_{k=0}^{\infty} \frac{x^k}{k}
$$

### Logarithmic Approximation

**Lemma** Với $0 < x < 1$ là một hằng số, ta có xấp xỉ:

$$
log(1+x) = x - x^2 + \mathcal{O}(x^3)
$$

Kết quả sau được chứng minh từ việc xấp xỉ Logarit sẽ được áp dụng để chứng minh Định lý Giới hạn Trung tâm - Central Limit Theorem.

$$
\lim_{N\to\infty} (1 + \frac{s^2}{2N})^N = e^{\frac{s^2}{2}}
$$

## Integration

Tích phân đổi biến:

$$
\int f(ax)dx = \frac{1}{a} \int f(u)du
$$

Tích phân từng phần:

$$
\int udv = uv - \int v du
$$

### Hàm chẵn, Hàm lẻ

Ta gọi hàm $f: \mathbb{R} \to \mathbb{R}$ là một hàm chẵn nếu với mọi $x \in \mathbb{R}$, $f(x) = f(-x)$; và đó là một hàm lẻ nếu $f(x) = -f(-x)$

Ta có: 

Nếu $f(x)$ là một hàm chẵn

$$
\int_{-a}^{a} f(x) dx = 2 \times \int_{0}^{a} f(x) dx
$$

Nếu $f(x)$ là một hàm lẻ

$$
\int_{-a}^{a} f(x) dx = 0
$$

### Nền tảng của định lý về Giải tích

Được áp dụng để học 2 khái niệm: Hàm mật độ xác suất (Probability Density Function - PDF) và Hàm phân phối tích luỹ (Cumulative Distribution Function - CDF). Định lý như sau:

Gọi f là một hàm liên tục trên khoảng $[a, b]$, ta có với mọi $x \in (a, b)$, 
$$
f(x) = \frac{d}{dx} \int_{a}^{x} f(t) dt
$$ 

Quy tắc chuỗi: 

$$
\frac{d}{dx} \int_{a}^{g(x)} f(t) dt = g'(x) \times f(g(x)) 
$$

Ví dụ áp dụng:

Tính tích phân sau:

$$
\frac{d}{dx} \int_{x}^{x-\mu} \frac{1}{\sqrt{2\pi\sigma^2}}\exp(-\frac{t^2}{2\sigma^2}) dt
$$

Ta đặt $y = x - \mu$, ta có:

$$
\frac{d}{dx} \int_{x}^{x-\mu} \frac{1}{\sqrt{2\pi\sigma^2}}\exp(-\frac{t^2}{2\sigma^2}) dt

\\

= \frac{dy}{dx} \times \frac{d}{dy} \int_{0}^{y} \frac{1}{\sqrt{2\pi\sigma^2}}\exp(-\frac{t^2}{2\sigma^2}) dt

\\

= \frac{d(x-\mu)}{dx} \times \frac{1}{\sqrt{2\pi\sigma^2}}\exp{-\frac{y^2}{2\sigma^2}}

\\

= \frac{1}{\sqrt{2\pi\sigma^2}}\exp{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

Đây là công thức để áp dụng cho phân phối Gaussian.

## Linear Algebra

### Data analysis

Các công thức tổng quát nhất cho việc phân tích dữ liệu là bài toán hồi quy tuyến tính:

$$
y = \sum_{n=1}^{N} \beta_n x_n
$$

### Inner Product, Norms

**Definition** Inner Product, gọi vector x, $\mathbb{x} = [x_1, x_2, ..., x_N]^T$ và y, $\mathbb{y} = [y_1, y_2, ..., y_N]^T$. Inner product của $\mathbb{x}^T\mathbb{y}$ là:

$$
\mathbb{x}^T\mathbb{y} = \sum_{i=1}^{N} x_i \times y_i
$$

Inner product được sử dụng để kiểm tra sự tương quan giữa 2 vector, nếu 2 vector cùng hướng thì giá trị inner product càng lớn, và nếu 2 vector vuông góc với nhau hoặc ngược hướng thì giá trị càng nhỏ dần.

**Definition** Norm. Gọi vector $\mathbb{x} = [x_1, x_2, ..., x_N]^T$, ta có $l_p$-norm của $\mathbb{x}$ là:

$$
||x||_p = (\sum_{i=1}^N x_i^p)^{1/p}
$$

**Definition** Góc cosine giữa 2 vector $\mathbb{x}, \mathbb{y}$ là:

$$
cos \phi = \frac{\mathbb{x}^T\mathbb{y}}{||\mathbb{x}||_2 ||\mathbb{y}||_2}
$$

### Matrix Calculus

Một số công thức đạo hàm theo ma trận cần nhớ

Cho $\mathbb{y} = \mathbb{x}^T \mathbf{A} \mathbb{x}$ với mọi ma trận $\mathbf{A} \in \mathbb{R}^{\mathbb{N} \times \mathbb{N}}$

Ta có:

$$
\frac{d}{dx} (\mathbb{x}^T \mathbf{A} \mathbb{x}) = \mathbf{A}\mathbb{x} + \mathbf{A}^T\mathbb{x}
$$

Nếu $\mathbf{A} = \mathbf{A}^T$ thì:

$$
\frac{d}{dx} (\mathbb{x}^T\mathbf{A}\mathbb{x}) = 2\mathbf{A}\mathbb{x}
$$
