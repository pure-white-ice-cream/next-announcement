"use client";

import { useEffect, useState } from "react";

type McServerRow = {
	name: string;
	address: string;
	port: string | null;
};

type AnnouncementResponse =
	| {
			ok: true;
			rows: McServerRow[];
	  }
	| {
			ok: false;
			message: string;
	  };

function hasPort(port: string | null | undefined): port is string {
	return typeof port === "string" && port.trim().length > 0;
}

async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		try {
			const ta = document.createElement("textarea");
			ta.value = text;
			ta.style.position = "fixed";
			ta.style.left = "-9999px";
			document.body.appendChild(ta);
			ta.select();
			const ok = document.execCommand("copy");
			document.body.removeChild(ta);
			return ok;
		} catch {
			return false;
		}
	}
}

export default function Home() {
	const [data, setData] = useState<AnnouncementResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

				if (!cancelled) setData(json as AnnouncementResponse);
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

	useEffect(() => {
		if (!copiedKey) return;
		const t = window.setTimeout(() => setCopiedKey(null), 1600);
		return () => window.clearTimeout(t);
	}, [copiedKey]);

	return (
		<div
			className="min-h-screen flex flex-col items-center justify-center px-4 py-12 font-sans selection:bg-amber-500/25"
			style={{
				background:
					"radial-gradient(ellipse 100% 70% at 50% -15%, rgba(251, 191, 36, 0.07), transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, rgba(99, 102, 241, 0.06), transparent 45%), linear-gradient(180deg, #12141a 0%, #0a0b10 50%, #06070a 100%)",
			}}
		>
			<main className="w-full max-w-lg flex flex-col items-center gap-8">
				<header className="text-center space-y-2">
					<div
						className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-zinc-600/60 bg-zinc-900/80 text-[11px] uppercase tracking-[0.2em] text-zinc-400"
						aria-hidden
					>
						<span className="size-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.55)]" />
						在线
					</div>
					<h1
						className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-100"
						style={{
							textShadow:
								"0 1px 0 rgba(0,0,0,0.9), 0 0 40px rgba(251, 191, 36, 0.12), 0 2px 12px rgba(0,0,0,0.8)",
						}}
					>
						服务器地址
					</h1>
					<p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
						加入游戏前请确认版本；点击下方按钮可一键复制地址或端口。
					</p>
				</header>

				<section
					className="w-full rounded-lg overflow-hidden border border-zinc-700/80 bg-zinc-950/40 shadow-[0_24px_48px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)]"
					style={{
						boxShadow:
							"0 0 0 1px rgba(39, 39, 42, 0.8), 0 24px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
					}}
				>
					<div
						className="px-4 py-2.5 flex items-center gap-2 border-b border-zinc-800/90 bg-gradient-to-b from-zinc-800/95 to-zinc-900/95"
					>
						<span className="text-zinc-300 text-xs font-semibold tracking-wide">公告 · mc</span>
					</div>

					<div className="bg-zinc-950/90 p-4 sm:p-5 space-y-4">
						{isLoading ? (
							<p className="text-center text-sm text-zinc-500 py-8">正在加载服务器信息…</p>
						) : data ? (
							data.ok ? (
								data.rows.length > 0 ? (
									<ul className="space-y-4">
										{data.rows.map((row, idx) => {
											const portOk = hasPort(row.port);
											const addrKey = `${idx}-address`;
											const portKey = `${idx}-port`;

											return (
												<li
													key={`${row.name}-${idx}`}
													className="rounded-lg border border-zinc-800/90 bg-zinc-900/50 p-4 space-y-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
												>
													<div className="flex items-center gap-2">
														<span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-zinc-800/90 text-zinc-300 border border-zinc-700/80">
															{row.name}
														</span>
													</div>

													<div className="space-y-1">
														<p className="text-[10px] uppercase tracking-widest text-zinc-600">
															地址
														</p>
														<p className="font-mono text-lg sm:text-xl text-zinc-100 break-all leading-snug tabular-nums">
															{row.address}
														</p>
														{portOk ? (
															<>
																<p className="text-[10px] uppercase tracking-widest text-zinc-600 pt-2">
																	端口
																</p>
																<p className="font-mono text-base text-zinc-300 tabular-nums">
																	{row.port!.trim()}
																</p>
															</>
														) : null}
													</div>

													<div className="flex flex-wrap gap-2 pt-1">
														<button
															type="button"
															onClick={async () => {
																const ok = await copyText(row.address.trim());
																if (ok) setCopiedKey(addrKey);
															}}
															className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors border border-zinc-600 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 hover:border-zinc-500 active:scale-[0.98]"
														>
															{copiedKey === addrKey ? "已复制" : "复制地址"}
														</button>
														{portOk ? (
															<button
																type="button"
																onClick={async () => {
																	const ok = await copyText(row.port!.trim());
																	if (ok) setCopiedKey(portKey);
																}}
																className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors border border-amber-600/50 bg-amber-950/40 text-amber-200/95 hover:bg-amber-950/70 hover:border-amber-500/60 active:scale-[0.98]"
															>
																{copiedKey === portKey ? "已复制" : "复制端口"}
															</button>
														) : null}
													</div>
												</li>
											);
										})}
									</ul>
								) : (
									<div className="text-center py-8 space-y-2">
										<p className="text-zinc-400 text-sm font-medium">暂无服务器记录</p>
										<p className="text-xs text-zinc-600 max-w-xs mx-auto">
											数据表 mc 中还没有条目，或表尚未创建。
										</p>
									</div>
								)
							) : (
								<div className="text-center py-8 space-y-2">
									<p className="text-red-400/95 text-sm font-medium">无法读取公告</p>
									<p className="text-xs text-zinc-500">{data.message}</p>
								</div>
							)
						) : (
							<p className="text-center text-sm text-zinc-500 py-8">暂无数据</p>
						)}
					</div>
				</section>
			</main>

			<footer className="mt-12 text-center text-[10px] text-zinc-600 tracking-wide">
				Minecraft 服务器地址公告
			</footer>
		</div>
	);
}
