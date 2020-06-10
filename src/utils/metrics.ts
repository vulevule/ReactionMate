export const comapareRectangles = (first: JSX.Element, second: JSX.Element) => {
    const {width: w1, height: h1} = first.props;
    const {width: w2, height: h2} = second.props;

    return (w1 * h1 > w2 * h2) ? first : second;
}

export const compareSquares = (first: JSX.Element, second: JSX.Element) => {
    const {size: s1} = first.props;
    const {size: s2} = second.props;

    return s1 > s2 ? first : second;
}

export const compareCircles = (first: JSX.Element, second: JSX.Element) => {
    return compareSquares(first, second);
}

export const comparePills = (first: JSX.Element, second: JSX.Element) => {
    return comapareRectangles(first, second);
}

export const squareMetric = (obj: JSX.Element) => {
    const {size, radius} = obj.props;
    return size * size - Math.pow(radius || 0, 2) * (4 - Math.PI);
}

export const circleMetric = (obj: JSX.Element) => {
    const {size} = obj.props;
    return Math.pow(size/2, 2) * Math.PI;
}

export const rectangleMetric = (obj: JSX.Element) => {
    const {width, height, radius} = obj.props;
    return width * height - Math.pow(radius || 0, 2) * (4 - Math.PI);
}

export const pillMetric = (obj: JSX.Element) => {
    return rectangleMetric(obj);
}

export const triangleMetric = (obj: JSX.Element) => {
    const {size} = obj.props;
    return Math.pow(size, 2) * (Math.sqrt(3) / 4);
}

export const brightnessMetric = (obj: JSX.Element) => {
    return obj.props.opacity
}