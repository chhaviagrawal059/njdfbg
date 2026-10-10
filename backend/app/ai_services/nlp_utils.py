import re
import math
from collections import Counter
from typing import List, Dict, Set, Tuple

ENGLISH_STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
    "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't",
    "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't",
    "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm",
    "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more",
    "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or",
    "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's",
    "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they",
    "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under",
    "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
    "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who",
    "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll",
    "you're", "you've", "your", "yours", "yourself", "yourselves"
}

def tokenize(text: str) -> List[str]:
    """Tokenizes text into lowercase alphanumeric words, filtering out English stop words."""
    words = re.findall(r'[a-zA-Z0-9]+', text.lower())
    return [w for w in words if w not in ENGLISH_STOP_WORDS and len(w) > 2]

def extract_ngrams(tokens: List[str], n: int = 2) -> List[str]:
    """Generates n-grams from list of tokens."""
    ngrams = []
    for i in range(len(tokens) - n + 1):
        ngrams.append(" ".join(tokens[i:i+n]))
    return ngrams

def compute_cosine_similarity(text1: str, text2: str) -> float:
    """
    Computes TF-IDF cosine similarity between two texts in pure Python.
    High performance, zero external native C-extensions or DLL dependencies.
    """
    tokens1 = tokenize(text1)
    tokens2 = tokenize(text2)

    if not tokens1 or not tokens2:
        return 0.0

    # Add bigrams for context
    features1 = tokens1 + extract_ngrams(tokens1, 2)
    features2 = tokens2 + extract_ngrams(tokens2, 2)

    counts1 = Counter(features1)
    counts2 = Counter(features2)

    all_features = set(counts1.keys()).union(set(counts2.keys()))

    # Document frequency for IDF
    idf = {}
    for feat in all_features:
        df = (1 if feat in counts1 else 0) + (1 if feat in counts2 else 0)
        idf[feat] = math.log((2.0 + 1.0) / (df + 1.0)) + 1.0

    # TF-IDF vectors
    vec1 = {feat: (counts1[feat] / len(features1)) * idf[feat] for feat in counts1}
    vec2 = {feat: (counts2[feat] / len(features2)) * idf[feat] for feat in counts2}

    # Dot product
    dot_product = sum(vec1[feat] * vec2.get(feat, 0.0) for feat in vec1)

    # Magnitudes
    mag1 = math.sqrt(sum(v ** 2 for v in vec1.values()))
    mag2 = math.sqrt(sum(v ** 2 for v in vec2.values()))

    if mag1 == 0.0 or mag2 == 0.0:
        return 0.0

    return round(dot_product / (mag1 * mag2), 3)

def compute_jaccard_similarity(text1: str, text2: str) -> float:
    """Computes token set intersection over union."""
    set1 = set(tokenize(text1))
    set2 = set(tokenize(text2))
    if not set1 or not set2:
        return 0.0
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return round(intersection / union, 3)
