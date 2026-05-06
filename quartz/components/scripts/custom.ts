document.addEventListener("DOMContentLoaded", () => {

  const charts = document.querySelectorAll(".jojo-chart");

  charts.forEach((container) => {

    const stats = [
      Number(container.getAttribute("data-magic")) || 0,
      Number(container.getAttribute("data-physical")) || 0,
      Number(container.getAttribute("data-potential")) || 0,
      Number(container.getAttribute("data-stamina")) || 0,
      Number(container.getAttribute("data-intellect")) || 0,
    ];

    const labels = [
      "Магическая сила",
      "Физическая сила",
      "Потенциал",
      "Выносливость",
      "Интеллект"
    ];

    const maxValue = 5;
    const size = 320;
    const center = size / 2;
    const radius = 100;

    const angleStep = (Math.PI * 2) / labels.length;

    function polarToCartesian(angle: number, r: number) {
      return {
        x: center + Math.cos(angle - Math.PI / 2) * r,
        y: center + Math.sin(angle - Math.PI / 2) * r
      };
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.classList.add("jojo-wrapper");

    // Внешний круг
    const outer = document.createElementNS(svg.namespaceURI, "circle");
    outer.setAttribute("cx", String(center));
    outer.setAttribute("cy", String(center));
    outer.setAttribute("r", String(radius + 25));
    outer.setAttribute("fill", "none");
    outer.setAttribute("stroke", "black");
    outer.setAttribute("stroke-width", "3");
    svg.appendChild(outer);

    // Кольца + буквы
    const ranks = ["E", "D", "C", "B", "A"];

    for (let i = 1; i <= maxValue; i++) {
      const r = (radius / maxValue) * i;

      const circle = document.createElementNS(svg.namespaceURI, "circle");
      circle.setAttribute("cx", String(center));
      circle.setAttribute("cy", String(center));
      circle.setAttribute("r", String(r));
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", "#aaa");
      svg.appendChild(circle);

      const text = document.createElementNS(svg.namespaceURI, "text");
      text.setAttribute("x", String(center));
      text.setAttribute("y", String(center - r + 12));
      text.textContent = ranks[i - 1];
      text.setAttribute("class", "jojo-label jojo-rank");
      svg.appendChild(text);
    }

    // Лучи + подписи
    labels.forEach((label, i) => {
      const angle = i * angleStep;

      const end = polarToCartesian(angle, radius);

      const line = document.createElementNS(svg.namespaceURI, "line");
      line.setAttribute("x1", String(center));
      line.setAttribute("y1", String(center));
      line.setAttribute("x2", String(end.x));
      line.setAttribute("y2", String(end.y));
      line.setAttribute("stroke", "#666");
      svg.appendChild(line);

      const labelPos = polarToCartesian(angle, radius + 40);

      const text = document.createElementNS(svg.namespaceURI, "text");
      text.setAttribute("x", String(labelPos.x));
      text.setAttribute("y", String(labelPos.y));
      text.textContent = label;
      text.setAttribute("class", "jojo-label");
      svg.appendChild(text);
    });

    // Полигон
    function createPolygon(values: number[]) {
      return values.map((val, i) => {
        const angle = i * angleStep;
        const r = (val / maxValue) * radius;
        const p = polarToCartesian(angle, r);
        return `${p.x},${p.y}`;
      }).join(" ");
    }

    const polygon = document.createElementNS(svg.namespaceURI, "polygon");
    polygon.setAttribute("points", createPolygon(stats));
    polygon.setAttribute("class", "jojo-polygon");
    svg.appendChild(polygon);

    container.appendChild(svg);

  });

});