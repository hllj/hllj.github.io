---
title: Projects
layout: splash
permalink: /projects/
collection: projects
entries_layout: list  # or 'list' depending on your preference
classes: wide  # optional, for wider content
---

## This is what I made

{% for post in site.categories.projects %}
  {% include archive-single.html type="grid" %}
{% endfor %}