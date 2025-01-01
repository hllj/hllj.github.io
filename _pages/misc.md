---
title: Miscellaneous
layout: collection
permalink: /misc/
classes: wide
---

{% for post in site.posts %}
  {% if post.path contains 'misc' %}
     {% include archive-single.html %}
  {% endif %}
{% endfor %} 