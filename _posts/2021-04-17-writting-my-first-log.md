---
title: "How I setup this blog"
categories:
  - blog
  - tutorial
tags:
  - english
  - tutorial
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
toc_sticky: true
header:
  teaser: "/images/blog.jpg"
  overlay_image: "/images/blog.jpg"
  overlay_filter: 0.7
  overlay_color: "#333"
---

In this post, I will describe all my setup for jekylll minimal mistake blog site, it took me a night to figure out what happened in this blog.

## Following docs in Minimal Mistake Theme

1.  Step 1: Fork the [Minimal Mistake Theme](https://github.com/mmistakes/minimal-mistakes/fork), then rename the repo to USERNAME.github.io with USERNAME is your username of github account.

    Do this step, you will create your repo name USERNAME.github.io that cloning all setups, including themes, layouts and let Github deploy your blog project in a certain hostname "USERNAME.github.io".
    ![Fork Minimal Mistake Theme](/images/mm-theme-fork-repo.png)

2.  Step 2: Setting up your page by editting _config.yaml file. Just follow and edit some properties you find interesing in [Configuration](https://mmistakes.github.io/minimal-mistakes/docs/configuration/).

3.  Step 3: Setting your own sitemap

    First changing your navigation in header in your site by editting _data/navigation.yml file.
    I would like to have 6 pages: Blog, Reading, Article, Project, Miscellaneous, FAQs.

    ```
      # main links
      main:
        - title: "Home"
          url: /
        - title: "Blog"
          url: /blog/
        - title: "Reading"
          url: /reading/
        - title: "Article"
          url: /article/
        - title: "Project"
          url: /project/
        - title: "Miscellaneous"
          url: /misc/
        - title: "FAQs"
          url: /faqs/
    ```

 4.   Step 4: Creating your pages

      Create a new folder name _pages, in _pages folder

## Creating my very first post (this one)

## Creating Reading pages

## Creating Articles pages

## Creating Project pages
