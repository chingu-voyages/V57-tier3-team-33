import { getExamples } from "../repositories/TestRepository.js";

export const fetchExample = async () => {
    const example = await getExamples();

    if (!example) {
        throw new Error('Database error');
    }

    return example;
}