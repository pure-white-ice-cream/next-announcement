import { TestD1Button } from "./test-d1-button";

export default function Home() {
	return (
		<div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<main className="flex flex-col gap-[32px] row-start-2 items-center">
				<div className="flex flex-col items-center gap-3 text-center">
					<h1 className="text-3xl font-semibold tracking-[-.04em]">D1 测试写入</h1>
					<p className="max-w-md text-sm leading-6 text-black/60 dark:text-white/60">
						点击按钮会在 D1 中创建测试表，并新增或更新名字为 test 的当前时间。
					</p>
				</div>
				<TestD1Button />
			</main>
			<footer className="row-start-3 text-center text-xs text-black/50 dark:text-white/50">Cloudflare D1 test</footer>
		</div>
	);
}
