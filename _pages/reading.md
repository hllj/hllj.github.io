---
title: Reading
layout: splash
permalink: /reading/
collection: reading
classes: wide  # optional, for wider content
---

## This is what I read

{% for post in site.categories.reading %}
  {% include archive-single.html type="grid" %}
{% endfor %}