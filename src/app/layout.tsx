import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Minecraft 服务器地址公告",
	description:
		"查看本 Minecraft 多人服务器的连接地址与端口，复制后即可在客户端多人游戏中加入。",
	openGraph: {
		title: "Minecraft 服务器地址公告",
		description:
			"查看本 Minecraft 多人服务器的连接地址与端口，复制后即可在客户端多人游戏中加入。",
		type: "website",
		locale: "zh_CN",
		images: [
			{
				url: "/og-minecraft.svg",
				width: 1200,
				height: 630,
				alt: "Minecraft 服务器地址公告预览图",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Minecraft 服务器地址公告",
		description:
			"查看本 Minecraft 多人服务器的连接地址与端口，复制后即可在客户端多人游戏中加入。",
		images: ["/og-minecraft.svg"],
	},
	icons: {
		icon: [{ url: "/favicon-minecraft.svg", type: "image/svg+xml" }],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-CN">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
