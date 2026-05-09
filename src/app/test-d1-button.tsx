"use client";

import { useState } from "react";

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

type ActionType = "read" | "write";

export function TestD1Button() {
	const [result, setResult] = useState<TestResponse | null>(null);
	const [actionType, setActionType] = useState<ActionType | null>(null);

	async function requestTestRecord(type: ActionType) {
		setActionType(type);
		setResult(null);

		try {
			const response = await fetch("/api/test", {
				method: type === "write" ? "POST" : "GET",
			});
			const data = (await response.json()) as TestResponse;
			setResult(data);
		} catch (error) {
			setResult({
				ok: false,
				message: error instanceof Error ? error.message : "请求失败",
			});
		} finally {
			setActionType(null);
		}
	}

	const isLoading = actionType !== null;

	return (
		<div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-black/[.08] p-6 text-center dark:border-white/[.145]">
			<div className="flex flex-col gap-3 sm:flex-row">
				<button
					type="button"
					onClick={() => requestTestRecord("write")}
					disabled={isLoading}
					className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{actionType === "write" ? "写入中..." : "测试写入 D1"}
				</button>
				<button
					type="button"
					onClick={() => requestTestRecord("read")}
					disabled={isLoading}
					className="rounded-full border border-black/[.08] px-5 py-3 text-sm font-medium transition-colors hover:bg-black/[.05] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[.145] dark:hover:bg-white/[.06]"
				>
					{actionType === "read" ? "读取中..." : "读取 D1 数据"}
				</button>
			</div>

			{result ? (
				<div className="text-sm leading-6">
					{result.ok ? (
						result.record ? (
							<p>
								已有数据：<span className="font-mono">{result.record.name}</span>，
								时间：<span className="font-mono">{result.record.updated_at}</span>
							</p>
						) : (
							<p className="text-black/60 dark:text-white/60">暂无 test 数据，请先点击写入。</p>
						)
					) : (
						<p className="text-red-600 dark:text-red-400">操作失败：{result.message}</p>
					)}
				</div>
			) : (
				<p className="text-sm text-black/60 dark:text-white/60">
					点击写入会创建或更新 test 记录；点击读取会展示当前已有数据。
				</p>
			)}
		</div>
	);
}
