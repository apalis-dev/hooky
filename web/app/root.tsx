import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";
import { Providers } from "./providers";
import stylesheet from "./globals.css?url";

export const links: LinksFunction = () => [
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap",
	},
	{ rel: "stylesheet", href: stylesheet },
	{
		rel: "icon",
		href: "/icon-light-32x32.png",
		media: "(prefers-color-scheme: light)",
	},
	{
		rel: "icon",
		href: "/icon-dark-32x32.png",
		media: "(prefers-color-scheme: dark)",
	},
	{
		rel: "icon",
		href: "/icon.svg",
		type: "image/svg+xml",
	},
	{
		rel: "apple-touch-icon",
		href: "/apple-icon.png",
	},
];

export const meta: MetaFunction = () => [
	{ title: "Webhook Dashboard" },
	{ name: "description", content: "Manage webhook endpoints and deliveries" },
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="font-sans antialiased">
				<Providers>{children}</Providers>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
