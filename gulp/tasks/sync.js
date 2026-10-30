import { cp, mkdir } from "node:fs/promises";
import { join } from "node:path";

// The UNC path is used when Gulp runs on Windows; WSL uses its native path.
const defaultDestination = process.platform === "win32"
	? "\\\\wsl.localhost\\Ubuntu\\home\\user\\projects\\teamuni\\src\\public\\front"
	: "/home/user/projects/teamuni/src/public/front";

export async function syncFront() {
	await syncAssets();
	await syncCss();
}

export async function syncAssets() {
	const destination = process.env.FRONT_SYNC_DEST || defaultDestination;
	await mkdir(destination, { recursive: true });
	await cp(app.path.build.assets, destination, { recursive: true });
}

export async function syncCss() {
	const destination = process.env.FRONT_SYNC_DEST || defaultDestination;
	await cp(app.path.build.css, join(destination, "css"), { recursive: true });
}
