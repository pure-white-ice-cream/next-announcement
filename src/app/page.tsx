"use client";

import { useEffect, useState } from "react";

type TestRecord = {
	id: number;
	name: string;
	updated_at: string;
};

type TestResponse =
	| {
			ok: true;
			record: TestRecord | null;
	  }
	| {
			ok: false;
			message: string;
	  };

export default function Home() {
	const [data, setData] = useState<TestResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setIsLoading(true);
			try {
				const response = await fetch("/api/test", { method: "GET" });

				let json: unknown = null;
				try {
					json = await response.json();
				} catch {
					// 非 JSON 响应时走兜底提示
				}

				if (!response.ok) {
					const message =
						typeof json === "object" && json && "message" in json
							? String((json as { message?: unknown }).message ?? "读取失败")
							: "读取失败";
					if (!cancelled) setData({ ok: false, message });
					return;
				}

				if (!cancelled) setData(json as TestResponse);
			} catch (error) {
				if (!cancelled)
					setData({
						ok: false,
						message: error instanceof Error ? error.message : "网络请求失败",
					});
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		}

		void load();
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<main className="flex flex-col gap-[22px] row-start-2 items-center">
				<div className="flex flex-col items-center gap-3 text-center">
					<h1 className="text-3xl font-semibold tracking-[-.04em]">公告板</h1>
					<p className="max-w-md text-sm leading-6 text-black/60 dark:text-white/60">
						进入页面会自动读取最新公告；如果没有数据，会显示友好提示。
					</p>
				</div>

				<section className="w-full max-w-md rounded-2xl border border-black/[.08] p-6 text-center dark:border-white/[.145]">
					{isLoading ? (
						<p className="text-sm text-black/60 dark:text-white/60">正在读取公告...</p>
					) : data ? (
						data.ok ? (
							data.record ? (
								<div className="flex flex-col gap-2">
									<p className="text-base font-medium">当前公告</p>
									<p className="text-sm text-black/70 dark:text-white/70">
										标识：<span className="font-mono">{data.record.name}</span>
									</p>
									<p className="text-sm text-black/70 dark:text-white/70">
										更新时间：<span className="font-mono">{data.record.updated_at}</span>
									</p>
								</div>
							) : (
								<div className="flex flex-col gap-2">
									<p className="text-base font-medium">暂无公告</p>
									<p className="text-sm text-black/60 dark:text-white/60">
										目前没有可展示的数据；你可以稍后刷新页面再试。
									</p>
								</div>
							)
						) : (
							<div className="flex flex-col gap-2">
								<p className="text-base font-medium">暂时无法读取公告</p>
								<p className="text-sm text-black/60 dark:text-white/60">
									{data.message}（可尝试刷新页面）
								</p>
							</div>
						)
					) : (
						<p className="text-sm text-black/60 dark:text-white/60">暂无数据</p>
					)}
				</section>
			</main>

			<footer className="row-start-3 text-center text-xs text-black/50 dark:text-white/50">
				Announcement board (read-only)
			</footer>
		</div>
	);
}
