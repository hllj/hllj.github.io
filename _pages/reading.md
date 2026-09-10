---
title: Reading
layout: splash
permalink: /reading/
classes: wide
---

## This is what I read

{% for post in site.categories.reading %}
  {% include archive-single.html type="grid" %}
{% endfor %}
