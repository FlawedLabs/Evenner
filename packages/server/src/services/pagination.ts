const pagination = (totalEvent: number, take: number, currentPage: number) => {
    const totalPage = Math.ceil(totalEvent / take);

    if (currentPage > totalPage || currentPage < 1) {
        throw new Error();
    }

    let skip: number = 0;
    if (currentPage > 1) {
        skip = take * (currentPage - 1);
    }

    return { take, skip };
};

export default pagination;
