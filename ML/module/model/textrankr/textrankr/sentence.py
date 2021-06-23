from typing import Tuple

from collections import Counter


__all__: Tuple[str, ...] = (
    'Sentence',
)


class Sentence:
    """
        The purpose of this class is as follows:

        1. In order to use the 'pagerank' function in the networkx library, you need a hashable object.
        2. Summaries should keep the sentence order from its original text to improve the verbosity.

        Note that the 'bow' stands for 'bag-of-words'.
    """

    def __init__(self, index: int, text: str, bow: Counter) -> None:
        self.index: int = index
        self.text: str = text
        self.bow: Counter = bow

    def __str__(self) -> str:
        return self.text

    def __hash__(self) -> int:
        return self.index
