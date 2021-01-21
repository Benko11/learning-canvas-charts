const canvas = document.querySelector(".my-canvas") as HTMLCanvasElement;
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

interface GraphOptions {
    gap: number;
    columnWidth: number;
    maxSize: number;
    legend: boolean;
    title: boolean;
}

interface Data {
    title: string;
    values: number[];
}

type Point = [number, number];

class GraphRendering {
    ctx: CanvasRenderingContext2D;
    base: Point;
    data: Data;
    options: GraphOptions | {};
    max: number;
    scale: number;

    constructor(x: number, y: number, data: Data) {
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.ctx.font = "10px 'Varela Round'";

        this.base = [x, y];
        this.data = data;
        this.options = {};
        this.max = this.scale = 0;
    }

    drawData(options: GraphOptions): void {
        this.options = options;
        this.max = Math.max(...this.data.values.map((item) => Math.abs(item)));
        this.scale = (this.options as GraphOptions).maxSize / this.max;

        if (options.title) {
            this.ctx.font = '32px "Varela Round"';
            this.ctx.fillText(
                this.data.title,
                this.base[0],
                this.base[1] - this.max * this.scale - 40
            );
            this.ctx.font = '10px "Varela Round"';
        }

        const { columnWidth, gap } = options;
        for (let value of this.data.values) {
            this.renderValue(value);

            this.base[0] += columnWidth + gap;
        }
    }

    renderValue(value: number): void {
        const { columnWidth, legend, maxSize, title } = this
            .options as GraphOptions;

        let [x, y] = this.base;
        const size = this.scale * value; // scaled size
        this.ctx.fillRect(x, y, columnWidth, -size);

        if (legend) {
            if (value > 0) y = y - size;
            else if (value === 0) return;
            y -= 10;

            this.ctx.fillText(String(value), x, y);
        }
    }
}

const data: Data = {
    title: "Appetite for life",
    values: [2, 4, 1, -99, 3, 100],
};
const graph = new GraphRendering(200, 400, data);
graph.drawData({
    gap: 10,
    columnWidth: 30,
    legend: true,
    maxSize: 300,
    title: true,
});
