import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
export async function GET(context: APIContext) {
	const posts = await getCollection("posts");
	// Filter to episodes
	const episodes = posts
		.filter(
			(post) =>
				post.data.categories.includes("episodes") &&
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
		},
		// Copy your extensive channel metadata from rss.xml here
		customData: `
      <language>en-US</language>
      <itunes:author>Hallie Casey, Chris Casey</itunes:author>
      <itunes:type>episodic</itunes:type>
      <itunes:owner>
        <itunes:name>Hallie Casey, Chris Casey</itunes:name>
        <itunes:email>onetogrowonpod@gmail.com</itunes:email>
      </itunes:owner>
      <itunes:image href="https://12go.onetogrowonpod.com/wp-content/uploads/2019/04/OTGO-1400.jpg" />
      <itunes:category text="Science">
        <itunes:category text="Nature" />
      </itunes:category>
      <!-- ... other categories -->
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
        <itunes:summary><![CDATA[${post.data.excerpt}]]></itunes:summary>
        <itunes:explicit>clean</itunes:explicit>
        <itunes:episodeType>full</itunes:episodeType>
        ${post.data.duration ? `<itunes:duration>${post.data.duration}</itunes:duration>` : ""}
        <content:encoded><![CDATA[${post.body}]]></content:encoded>
      `,
		})),
	});
}
