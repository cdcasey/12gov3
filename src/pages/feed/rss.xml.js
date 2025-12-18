import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
	// Get all episodes and sort them by date (newest first)
	const episodes = await getCollection("episodes");
	const sortedEpisodes = episodes.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	return rss({
		// 1. Main Show Metadata (Copied from your XML)
		title: "One to Grow On",
		description: "Understanding how food production impacts us and our world",
		site: context.site,
		// We map your old feed link to the new one so apps update
		items: sortedEpisodes.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/episodes/${post.slug}/`, // Adjust if your URL structure is different

			// 2. The Audio File
			enclosure: {
				url: post.data.audioUrl,
				length: post.data.audioSize,
				type: "audio/mpeg",
			},

			// 3. Episode Specific Data
			customData: `
        <itunes:duration>${post.data.duration}</itunes:duration>
        <itunes:explicit>${post.data.explicit ? "yes" : "clean"}</itunes:explicit>
        ${post.data.episodeNumber ? `<itunes:episode>${post.data.episodeNumber}</itunes:episode>` : ""}
      `,
		})),

		// 4. Custom Podcast Namespaces & Global Data
		xmlns: {
			itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
			content: "http://purl.org/rss/1.0/modules/content/",
			podcast: "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
		},
		customData: `
      <language>en-US</language>
      <itunes:author>Hallie Casey, Chris Casey</itunes:author>
      <itunes:summary>One to Grow On is a podcast where we dig into questions about agriculture...</itunes:summary>
      <itunes:owner>
        <itunes:name>Hallie Casey, Chris Casey</itunes:name>
        <itunes:email>onetogrowonpod@gmail.com</itunes:email>
      </itunes:owner>
      <itunes:image href="https://pub-95244d2d82644d35bb2d737bd39a6f4f.r2.dev/OTGO-1400.jpg" />
      <itunes:category text="Science">
        <itunes:category text="Nature" />
      </itunes:category>
      <itunes:category text="Health & Fitness">
        <itunes:category text="Nutrition" />
      </itunes:category>
      <itunes:category text="Leisure">
        <itunes:category text="Home & Garden" />
      </itunes:category>
      <itunes:explicit>clean</itunes:explicit>
      <itunes:type>episodic</itunes:type>
    `,
	});
}
