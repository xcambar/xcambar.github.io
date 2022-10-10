---
layout: default.njk
title: Xavier Cambar
---


# Welcome

I am Xavier.<br>
I am a married father of two.<br> I work as an Engineering Manager at [Clark](clark.de).
<br>
You can visit [my LinkedIn page](https://linkedin.com/in/xavier.cambar) for details.
<br>
You can also get in touch by [Email](mailto:xavier@two15.co).

<hr/>

What you will find here:

{% for post in collections.post %}
* [{{post.data.title}}]({{post.url}})

{%- endfor -%}
