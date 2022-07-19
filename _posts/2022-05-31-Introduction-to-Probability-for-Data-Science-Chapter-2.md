---
title: "[Read with me] Introduction to Probability for Data Science - Chapter 2"
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

# Chapter 2: Probability

## Introduction

Data vs. Probability
Frequentists vs. Bayesians

	- Frequentists: "Probability is the relative frequency of an outcome"
	- Bayesians: "Probability is a subjective belief"

Cả hai góc nhìn của mỗi bên đều có lý, nó phụ thuộc vào bài toán chúng ta gặp phải, có thể sử dụng theo hướng nào. Ví dụ như, nếu chúng ta gặp một bài toán có hữu hạn dữ liệu, vậy nên sử dụng Xác suất theo hướng của Bayesians có thể giúp ta thêm những thông tin trước (prior knowledge); trong khi đó, Frequentists cho ta tính toán được mức độ tin cậy của một ước lượng.

**Summary: "Probability is a measure of the size of a set"**

## Prelude:

- Sample Space (Không gian mẫu): is the set containing all possible outcomes. $$\Omega = \{1, 2, 3, 4, 5, 6 \}$$

- Event (Sự kiện): Set of outcomes meet conditions.

Các thành phần của Xác suất:

(i) Có một không gian mẫu

(ii) Có một sự kiện là tập con của không gian mẫu.

(iii) Xác suất là con số tương quan giữa số lượng phần tử trong tập Sự kiện E so với số lượng trong không gian mẫu S.

## 2.1 Set Theory

Set (Tập hợp): là một bộ các phần tử (có thể là số, chữ cái, ...)

Lý thuyết tập hợp bao gồm các phép tính trên tập hợp, giúp chúng ta có thể kết hợp, phân tách, ... các tập hợp.

Ví dụ:

$$
A = \{ apple, orange, pear \}
\\
A = \{ 1, 2, 3, 4, 5 \}
\\
A = \{ 2, 4, 6, 8, ... \} \text{is a countable but infinite set}
\\
A = \{ x \| 0 < x < 1\} \text{is a uncountable set}
\\
A = \{ f: \mathbb{R} \to \mathbb{R} \| f(x) = ax + b, a, b \in \mathbb{R} \} \text{is a set of functions}
\\
A = \{1, 2\}, B = \{3\}; C = \{A, B\} \text{is a set of sets.}
$$

Tập hợp con (subset): Là một phần của một tập hợp (set).

B là tập hợp con của A, nếu mọi phần tử thuộc trong B, đều thuộc trong A.

$$
B \subseteq A \text{ if } \forall \zeta \in B, \zeta \in A.
$$

Tập hợp rỗng (Empty set): Là tập hợp không có phần tử nào. $$A = \emptyset $$

Tập hợp tổng quát (Universal set): Là tập chứa mọi phần tử. $$U = \Omega$$

### Union (Phép hợp)

Hợp của 2 tập A, B chứa toàn bộ các phần tử có trong A **hoặc** có trong B. 

$$
A \cup B = \{ \zeta | \zeta \in A \text{  or  } \zeta \in B \}
$$

### Intersection (Phép giao)

Phép hợp của 2 tập hợp dựa trên toán tử logic or. Nếu chúng ta dùng toán tử and thì ta sẽ có tập giao giữa 2 tập.

$$
A \cap B = \{ \zeta | \zeta \in A \text{  and  } \zeta \in B \}
$$

### Phần bù (Complement) và Hiệu (Difference)

Phần bù của tập A là tập hợp chứa các phần tử trong $\Omega$ nhưng không trong A.

$$
A^c = \{ \zeta | \zeta \in \Omega \text{  and } \zeta \notin A \}
$$ 

Hiệu A\B là tập hợp chứa các phần tử trong A nhưng không trong B.

$$
A \ B = \{ \zeta | \zeta \in A \text{  and  } \zeta \notin B \}
$$

## Không gian xác suất

Không gian xác suất bao gồm: Không gian mẫu $\Omega$, Không gian sự kiện $\mathbf{F}$, và Probability Law $\mathbb{P}$

Probability Law là một hàm nhận vào một sự kiện và trả về một con số.

Chúng ta coi Probability Law $\mathbb{P}$ là một cách đo đạc, có thể dùng phương pháp đếm (counter), đo độ dài (với các đoạnliên tục), đo diện tích, ...

Ngoài ra, chúng ta nên nhìn nhận $\mathbb{P}$ là một hàm có trọng số (weighting function), các Probability Law khác nhau khi có hàm trọng số khác nhau.

### Tập được tính là zero.

	- Là một tập hợp $\mathbf{E}$ không rỗng có xác suất $\mathbb{P}[E] = 0$
	- Khi ta dùng một tập hợp $\mathbf{E}$ rời rạc đếm nhưng lại sử dụng một cách đo đạc liên tục (ví dụ trong các Probability Law $\mathbb{F}$ liên tục), kết quả trả về là 0.
	- Tuy nhiên khi sử dụng các độ đo rời rạc $\mathbb{G}$ thì nó vẫn có thể có kết quả dương.


