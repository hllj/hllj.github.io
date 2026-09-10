---
title: Projects
layout: splash
permalink: /projects/
classes: wide
---

## This is what I made

{% for post in site.categories.projects %}
  {% include archive-single.html type="grid" %}
{% endfor %}
