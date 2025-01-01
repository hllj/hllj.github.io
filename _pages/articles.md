---
title: Articles
layout: collection
permalink: /articles/
collection: articles
entries_layout: list
classes: wide
---

## This is where I read

{% for post in site.posts %}
  {% if post.path contains 'articles' %}
     {% include archive-single.html %}
  {% endif %}
{% endfor %} 