---
title: Projects
layout: collection
permalink: /projects/
collection: projects
entries_layout: grid
classes: wide
---

## This is where I made

{% for post in site.posts %}
  {% if post.path contains 'projects' %}
     {% include archive-single.html %}
  {% endif %}
{% endfor %} 