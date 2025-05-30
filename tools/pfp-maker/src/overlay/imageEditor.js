class Editor {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		// image
		this.pfpImg = null;

		// pfp variables / settings
		this.pfpImgScale = 0;
		this.pfpRingScale = 0;

		this.pfpImgOffInc = 2;
		this.pfpImgOffX = 0;
		this.pfpImgOffY = 0;

		// pfp
		this.bgMode = false; // true: ring, false: background
		this.flagId = 0;

		// overlay
		this.flagImg = null;
		this.customFlag = false;

		this.blur = true;
		// event latches - configurable !
		// this.onImgLoad = () => {};
	}

	// standard methods
	loadPfpImg(img) {
		this.pfpImg = img;
		this.resetSettingsDefault();
	}

	loadFlagImg(img) {
		this.flagImg = img;
		this.customFlag = true;
	}

	clearFlagImg() {
		this.flagImg = null;
		this.customFlag = false;
	}

	setBgMode(val) {
		this.bgMode = val;
		this.resetSettingsDefault();
		this.refreshCanvas();
	}

	setPfpImageScale(val) {
		var before = this.pfpImgScale;
		this.pfpImgScale = val;

		// fix img offset to account for scale
		var ratio = val / before;
		//console.log(val, before, ratio)
		if (val === 0 || before === 0 || ratio === 0 || ratio === Infinity)
			// im trying my best to avoid NaNs ;-;
			return;

		this.pfpImgOffX *= ratio;
		this.pfpImgOffY *= ratio;
	}

	// refreshing the main canvas
	refreshCanvas() {
		const flagCanvas = document.createElement("canvas");

		this.canvas.width =
			flagCanvas.width =
			this.canvas.height =
			flagCanvas.height =
				this.pfpImg.width; // force canvas into square

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // setting width|height should've cleared it,
		// but just in case :3

		const overlay = presetOverlays[this.flagId];

		if (this.bgMode) {
			this.drawFlag(flagCanvas, overlay);

			this.ctx.drawImage(
				this.metodo(flagCanvas),
				0,
				0,
				this.canvas.width,
				this.canvas.height
			);
			this.drawPfpImg();
		} else {
			this.drawFlag(flagCanvas, overlay);
			overlay.obj.EraseCircleOnCanvas(flagCanvas, this.pfpRingScale);

			this.drawPfpImg();
			this.ctx.drawImage(
				this.metodo(flagCanvas),
				0,
				0,
				this.canvas.width,
				this.canvas.height
			);
		}
	}

	metodo(flagCanvas) {
		const { width: w, height: h } = this.canvas;
		const canvas = document.createElement("canvas");
		const flagCtx = flagCanvas.getContext("2d");
		const canvasCtx = canvas.getContext("2d");
		const x = flagCanvas.width / 2 - w / 2;
		const imageContentRaw = flagCtx.getImageData(x, 0, w, h);
		canvas.width = w;
		canvas.height = h;
		canvasCtx.putImageData(imageContentRaw, 0, 0);
		return canvas;
	}

	// -- helper
	drawPfpImg() {
		const scaledWidth = this.pfpImgScale * this.pfpImg.width;
		const scaledHeight = this.pfpImgScale * this.pfpImg.height;

		const widthHeightRatio = this.pfpImg.width / this.pfpImg.height;

		this.ctx.drawImage(
			this.pfpImg,
			-(scaledWidth - this.pfpImg.width) / 2 + this.pfpImgOffX,
			-(scaledHeight - this.pfpImg.height * widthHeightRatio) / 2 +
				this.pfpImgOffY,
			scaledWidth,
			scaledHeight
		);
	}

	drawFlag(canvas, overlay) {
		// Custom overlay loaded
		if (this.customFlag) {
			const ctx = canvas.getContext("2d");

			var canvScale = 0;
			var x = 0;
			var y = 0;

			// Overlay width bigger than height
			if (this.flagImg.width > this.flagImg.height) {
				canvScale = this.canvas.height / this.flagImg.height;
				x = canvas.width / 2 - (this.flagImg.width * canvScale) / 2;
			}
			// Overlay height bigger than width
			else {
				canvScale = this.canvas.height / this.flagImg.width;
				y = canvas.height / 2 - (this.flagImg.height * canvScale) / 2;
			}
			ctx.filter = getFilter();
			ctx.drawImage(
				this.flagImg,
				x,
				y,
				this.flagImg.width * canvScale,
				this.flagImg.height * canvScale
			);
			ctx.filter = "none";
		}
		// Standard overlay
		else {
			overlay.obj.DrawFlagOnCanvas(canvas, this.blur);
		}
	}

	// settings
	fitWholeImageScale() {
		if (this.pfpImg.width > this.pfpImg.height)
			this.setPfpImageScale(this.pfpImg.width / this.pfpImg.height);
		else this.setPfpImageScale(this.pfpImg.height / this.pfpImg.width);

		// this.pfpImgScale = (this.pfpImg.width > this.pfpImg.height)
		//     ? this.pfpImg.width / this.pfpImg.height
		//     : this.pfpImg.height / this.pfpImg.width;
	}

	fitImgScaleToRing() {
		this.fitWholeImageScale();
		this.setPfpImageScale(this.pfpImgScale * this.pfpRingScale);
	}

	resetPfpRingScale() {
		if (this.bgMode) {
			this.pfpRingScale = 1;
		} else {
			this.pfpRingScale = 0.9; // 0.9 thin, 0.875 thick
		}
	}

	resetSettingsDefault() {
		this.pfpImgOffX = 0;
		this.pfpImgOffY = 0;

		this.resetPfpRingScale();
		this.fitImgScaleToRing();
	}
}
