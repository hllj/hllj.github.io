---
title: Reading
layout: collection
permalink: /reading/
collection: reading
entries_layout: list
classes: wide
---

## This is where I read

{% for post in site.posts %}
  {% if post.path contains 'reading' %}
     {% include archive-single.html %}
  {% endif %}
{% endfor %} 