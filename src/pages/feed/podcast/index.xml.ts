import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
export async function GET(context: APIContext) {
	const posts = await getCollection("posts");
	// Filter to episodes
	const episodes = posts
		.filter(
			(post) =>
				(post.data.categories.includes("episodes") ||
					post.data.categories.includes("promo")) &&
				post.data.audio &&
				!post.data.slug.endsWith("-transcript"),
		)
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
	return rss({
		title: "One to Grow On",
		description: "Understanding how food production impacts us and our world",
		site: context.site!,
		xmlns: {
			itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
			podcast: "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
			content: "http://purl.org/rss/1.0/modules/content/",
			atom: "http://www.w3.org/2005/Atom",
		},
		customData: `
      <atom:link href="${new URL("/feed/podcast/index.xml", context.site)}" rel="self" type="application/rss+xml" />
      <language>en-US</language>
      <itunes:author>Hallie Casey, Chris Casey</itunes:author>
      <itunes:subtitle>How Agriculture and Food Production Affect Us and Our World</itunes:subtitle>
      <itunes:summary>One to Grow On is a podcast where we dig into questions about agriculture and try to understand how food production impacts us and our world. One to Grow On is hosted by resident expert Hallie Casey and her very own dad.</itunes:summary>
      <itunes:explicit>false</itunes:explicit>
      <itunes:type>episodic</itunes:type>
      <itunes:owner>
        <itunes:name>Hallie Casey, Chris Casey</itunes:name>
        <itunes:email>onetogrowonpod@gmail.com</itunes:email>
      </itunes:owner>
      <itunes:image href="${new URL("/images/OTGO-1400.jpg", context.site)}" />
      <itunes:category text="Science">
        <itunes:category text="Nature" />
      </itunes:category>
      <itunes:category text="Health &amp; Fitness">
        <itunes:category text="Nutrition" />
      </itunes:category>
      <itunes:category text="Leisure">
        <itunes:category text="Home &amp; Garden" />
      </itunes:category>
      <podcast:funding url="https://www.patreon.com/onetogrowonpod">Our Patreon!</podcast:funding>
    `,
		items: episodes.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.excerpt,
			link: `/${post.data.slug}/`,
			enclosure: {
				url: post.data.audio!,
				length: post.data.audioSize ?? 0,
				type: "audio/mpeg",
			},
			customData: `
        ${post.data.guid ? `<guid isPermaLink="false">${post.data.guid}</guid>` : ""}
        <itunes:summary><![CDATA[${post.data.excerpt}]]></itunes:summary>
        <itunes:explicit>false</itunes:explicit>
        <itunes:episodeType>${post.data.categories.includes("promo") ? "trailer" : "full"}</itunes:episodeType>
        ${post.data.duration ? `<itunes:duration>${post.data.duration}</itunes:duration>` : ""}
        <content:encoded><![CDATA[${post.body}]]></content:encoded>
      `,
		})),
	});
}
