import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Check, X, Play, RefreshCw, Zap, Lightbulb, 
  ChevronRight, ToggleLeft, ToggleRight, HelpCircle, 
  Layout, ArrowLeft, Star, Lock, Calculator,
  Activity, HardDrive, Share2,
  Target, Sigma, GraduationCap, School,
  Search, Sun, Moon
} from 'lucide-react';

// --- Types & Interfaces ---

type ViewState = 'dashboard' | 'topic-menu' | 'activity' | 'learn';
type ActivityType = 'quiz' | 'truthlab' | 'translator' | 'classifier' | 'matrixlab' | 'knnvis' | 'bayescalc' | 'entropylab';
type LearnLevel = 'beginner' | 'intermediate' | 'advanced' | 'mastery';
type Theme = 'light' | 'dark';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface TranslationChallenge {
  id: number;
  sentence: string;
  variables: { [key: string]: string };
  correctFormula: string[];
  tokens: string[];
}

interface LearnContent {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
  mastery: string[];
}

interface TopicContent {
  id: string;
  title: string;
  description: string;
  availableActivities: ActivityType[];
  quizQuestions: Question[];
  translationChallenges?: TranslationChallenge[];
  learnContent: LearnContent;
}

interface Module {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  topics: TopicContent[];
}

// --- Course Data Repository ---

const COURSE_CONTENT: Module[] = [
  {
    id: "mod1",
    title: "Logic & Reasoning",
    icon: Lightbulb,
    color: "text-blue-500",
    topics: [
      {
        id: "logic_lec5_6",
        title: "Propositional Logic",
        description: "Lectures 5 & 6: Atoms, Connectives, Truth Tables",
        availableActivities: ['quiz', 'truthlab', 'translator', 'classifier'],
        learnContent: {
          beginner: [
            "A Proposition is a declarative statement that is either True or False.",
            "Atomic propositions are simple facts (e.g., 'It is raining').",
            "Connectives join atoms: AND (∧), OR (∨), NOT (¬), IMPLIES (⇒).",
            "Example: p ∧ q means 'Both p and q are true'."
          ],
          intermediate: [
            "Truth Tables list all possible T/F combinations to define a connective.",
            "AND (∧) is only True if BOTH sides are True.",
            "OR (∨) is Inclusive: True if at least one side is True.",
            "Implication (p ⇒ q) is only False if p is True and q is False.",
            "Equivalence (⇔) is True if p and q have the same value."
          ],
          advanced: [
            "Tautology: A formula that is ALWAYS True (e.g., p ∨ ¬p).",
            "Contradiction: A formula that is ALWAYS False (e.g., p ∧ ¬p).",
            "Contingent: A formula that depends on the inputs (most normal formulas).",
            "Syntactic Ambiguity: 'p ∧ q ∨ r' is ambiguous. Use brackets: '(p ∧ q) ∨ r'."
          ],
          mastery: [
            "Logical Equivalence (≡) means two formulas have identical Truth Tables.",
            "Entailment (|=): A |= B means if A is true, B MUST be true.",
            "De Morgan's Laws: ¬(p ∧ q) ≡ ¬p ∨ ¬q.",
            "Implication Equivalence: p ⇒ q is logically equivalent to ¬p ∨ q."
          ]
        },
        quizQuestions: [
          { id: 1, question: "What does the symbol ∧ represent?", options: ["Or (Disjunction)", "And (Conjunction)", "Implies", "Not"], correct: 1, explanation: "∧ is the symbol for AND (Conjunction). It points up like an 'A'." },
          { id: 2, question: "What does the symbol ¬ represent?", options: ["Equivalence", "And", "Negation (Not)", "Or"], correct: 2, explanation: "¬ represents Negation, flipping True to False." },
          { id: 3, question: "When is p ∨ q (Inclusive Or) false?", options: ["When p is True", "When q is True", "When both are False", "When both are True"], correct: 2, explanation: "Inclusive OR is only false if BOTH sides are false." },
          { id: 4, question: "What is a Tautology?", options: ["Always False", "Always True", "Sometimes True", "A logical error"], correct: 1, explanation: "A Tautology is a proposition that is TRUE under all possible assignments." },
          { id: 5, question: "p ⇒ q is FALSE only when...", options: ["p is True and q is False", "p is False and q is True", "Both are False", "Both are True"], correct: 0, explanation: "Implication is only broken when the premise (p) is True but the conclusion (q) is False." },
        ],
        translationChallenges: [
          {
            id: 1,
            sentence: "If Abdullah does not have a headache, then Abdullah is well.",
            variables: { p: "Abdullah has a headache", q: "Abdullah is well" },
            correctFormula: ["(", "¬", "p", ")", "⇒", "q"],
            tokens: ["p", "q", "¬", "⇒", "∧", "∨", "(", ")"]
          },
          {
            id: 2,
            sentence: "I study at home (p) and I go to university (q).",
            variables: { p: "Study at home", q: "Go to university" },
            correctFormula: ["p", "∧", "q"],
            tokens: ["p", "q", "¬", "⇒", "∧", "∨"]
          }
        ]
      }
    ]
  },
  {
    id: "mod2",
    title: "Data Mining & ML",
    icon: HardDrive,
    color: "text-green-500",
    topics: [
      {
        id: "dm_lec2",
        title: "Input & Output",
        description: "Lecture 2: Attributes, Weka & ARFF",
        availableActivities: ['quiz'],
        learnContent: {
          beginner: [
            "Data Mining input is typically a table (Relation).",
            "Rows are called Instances (or Examples).",
            "Columns are called Attributes (or Features).",
            "Weka is a popular tool for ML that uses the ARFF file format."
          ],
          intermediate: [
            "ARFF Structure: Header (@relation), Definitions (@attribute), Data (@data).",
            "Attribute Types: Numeric (Numbers), Nominal (Categories/Labels), String (Text), Date.",
            "Class Attribute: The thing we want to predict (usually the last column)."
          ],
          advanced: [
            "Sparse Data: When most values are 0 (e.g., text mining word counts).",
            "Sparse ARFF: Stores only non-zero values to save space (e.g., {1 5, 3 2} means index 1 is 5, index 3 is 2).",
            "Missing Values: Represented by '?' in Weka."
          ],
          mastery: [
            "Garbage In, Garbage Out: The quality of input data determines the quality of the model.",
            "Attribute Types dictate Algorithm choice (e.g., Linear Regression needs numbers, Naive Bayes handles nominals well).",
            "Denormalization: Flattening relational tables into one table creates redundancy but allows propositional learning."
          ]
        },
        quizQuestions: [
          { id: 1, question: "What does ARFF stand for?", options: ["Attribute-Relation File Format", "Automated Regression File Format", "Association Rule File Format", "Array Relation File Format"], correct: 0, explanation: "ARFF (Attribute-Relation File Format) is the standard file format used by Weka." },
          { id: 2, question: "Which attribute type represents distinct categories?", options: ["Numeric", "Nominal", "Ordinal", "Ratio"], correct: 1, explanation: "Nominal attributes represent distinct categories or labels (e.g., 'Sunny', 'Rainy')." },
          { id: 3, question: "If data is 'sparse' (mostly zeros), which format is more efficient?", options: ["Dense ARFF", "Sparse ARFF", "CSV", "Excel"], correct: 1, explanation: "Sparse ARFF format only lists non-zero values, saving significant space." }
        ]
      },
      {
        id: "dm_lec2b",
        title: "Relational Learning",
        description: "Lecture 2b: Predicate Logic & Relations",
        availableActivities: ['quiz'],
        learnContent: {
          beginner: [
            "Propositional Logic uses simple rules (If X > 5 then Yes).",
            "Relational Learning deals with relationships between objects.",
            "Example: 'Parent of', 'Next to', 'Bigger than'."
          ],
          intermediate: [
            "Propositional rules struggle to express 'A is an ancestor of B'.",
            "Predicate Logic allows variables: Ancestor(X, Y).",
            "Inductive Logic Programming (ILP) learns these first-order logic rules."
          ],
          advanced: [
            "The 'Ancestor' problem requires Recursion.",
            "Rule 1: If Parent(X, Y) -> Ancestor(X, Y).",
            "Rule 2: If Parent(X, Z) AND Ancestor(Z, Y) -> Ancestor(X, Y)."
          ],
          mastery: [
            "Propositionalization: Converting relational data into a single table (denormalization) so standard algorithms (like ID3) can be used.",
            "This often results in enormous tables with many null values.",
            "Direct Relational Learning is more powerful but computationally expensive."
          ]
        },
        quizQuestions: [
          { id: 1, question: "Why might Propositional Logic fail for some concepts?", options: ["It is too slow", "It cannot easily represent relationships between objects (like 'ancestor')", "It cannot handle numbers", "It is always false"], correct: 1, explanation: "Propositional rules struggle with relationships (e.g., 'X is ancestor of Y') which often require Predicate Logic." },
          { id: 2, question: "To represent an 'ancestor' relationship effectively, what is often needed?", options: ["Recursion", "Simplification", "Denormalisation", "Clustering"], correct: 0, explanation: "Infinite relations like 'ancestor' often require recursive rules (Ancestor(X,Y) if Parent(X,Z) AND Ancestor(Z,Y))." },
          { id: 3, question: "What is 'Denormalisation'?", options: ["Cleaning data", "Flattening relational tables into a single table", "Removing duplicates", "Converting text to numbers"], correct: 1, explanation: "Denormalisation joins multiple tables into one so propositional learners can be applied, though it creates redundancy." }
        ]
      },
      {
        id: "dm_lec3",
        title: "1R Algorithm",
        description: "Lecture 3: The Simplest Induction",
        availableActivities: ['quiz'],
        learnContent: {
          beginner: [
            "1R stands for 'One Rule'.",
            "It is a very simple algorithm that makes a rule based on just ONE attribute.",
            "It generates a 1-level Decision Tree."
          ],
          intermediate: [
            "The Algorithm: For each attribute, form a rule. Calculate the error rate. Choose the attribute with the lowest error rate.",
            "It serves as a baseline: If your complex AI can't beat 1R, it's not very good."
          ],
          advanced: [
            "Handling Numeric Attributes: 1R must 'discretize' numbers into buckets (e.g., Hot, Mild, Cool).",
            "Overfitting: If an attribute has unique values (like an ID code), 1R will pick it because it has 0 error on training data, but it fails on new data."
          ],
          mastery: [
            "Minimum Bucket Size: To prevent overfitting on numbers, we enforce a minimum number of examples per interval.",
            "1R often performs surprisingly well on real-world datasets despite its simplicity."
          ]
        },
        quizQuestions: [
          { id: 1, question: "How deep is a 1R decision tree?", options: ["1 Level", "2 Levels", "Infinite", "It depends on the data"], correct: 0, explanation: "1R (One Rule) generates a 1-level decision tree, testing only a single attribute." },
          { id: 2, question: "How does 1R handle numeric attributes?", options: ["It ignores them", "It normalises them", "It discretises them into intervals", "It converts them to text"], correct: 2, explanation: "1R discretises numeric values (e.g., dividing temperature into 'hot', 'mild', 'cool')." },
          { id: 3, question: "What is the problem with 1R if we use an 'ID code' attribute?", options: ["It is too slow", "It overfits drastically", "It cannot process numbers", "It creates too many rules"], correct: 1, explanation: "1R will pick the ID code because it perfectly identifies every example (0 errors), but this generalizes poorly (Overfitting)." }
        ]
      },
      {
        id: "dm_lec4",
        title: "Naive Bayes",
        description: "Lecture 4: Probabilistic Classification",
        availableActivities: ['quiz', 'bayescalc'],
        learnContent: {
          beginner: [
            "Uses probability to predict the class.",
            "Based on Bayes' Theorem.",
            "It assumes attributes are 'Independent' (not related to each other)."
          ],
          intermediate: [
            "Prior Probability P(H): How likely is the hypothesis generally?",
            "Likelihood P(E|H): If the hypothesis is true, how likely is this evidence?",
            "Posterior P(H|E): The result. Probability of H given Evidence E."
          ],
          advanced: [
            "The 'Naive' Assumption: It assumes attributes don't affect each other (e.g., Temperature doesn't affect Humidity). This is often false, but the algorithm still works well.",
            "Zero-Frequency Problem: If an event never appears in the training data, its probability is 0, which kills the whole equation."
          ],
          mastery: [
            "Laplace Estimator: The fix for Zero-Frequency. Add 1 to the count of every outcome (start with 'virtual' counts).",
            "Missing Values: Naive Bayes handles them easily by simply ignoring them in the likelihood calculation."
          ]
        },
        quizQuestions: [
          { id: 1, question: "Why is Naive Bayes called 'Naive'?", options: ["It is simple", "It assumes all attributes are independent", "It was created by a novice", "It ignores the class label"], correct: 1, explanation: "It makes the 'naive' assumption that attributes are statistically independent given the class." },
          { id: 2, question: "What is used to solve the 'Zero-frequency problem'?", options: ["The Laplace Estimator", "Removing the data", "Setting probability to 1", "Cross validation"], correct: 0, explanation: "The Laplace Estimator adds a small count (usually 1) to frequencies to prevent zero probabilities." },
          { id: 3, question: "Bayes Theorem calculates which probability?", options: ["Prior P(H)", "Likelihood P(E|H)", "Posterior P(H|E)", "Evidence P(E)"], correct: 2, explanation: "It calculates the Posterior: the probability of a Hypothesis given the Evidence." }
        ]
      },
      {
        id: "dm_lec5",
        title: "k-Nearest Neighbour",
        description: "Lecture 5: Instance-Based Learning",
        availableActivities: ['quiz', 'knnvis'],
        learnContent: {
          beginner: [
            "kNN is 'Lazy Learning'. It doesn't build a model.",
            "It memorizes the training data.",
            "To classify a new item, it looks at the 'k' closest items in the training set."
          ],
          intermediate: [
            "Distance Metric: Usually Euclidean Distance (straight line) for numbers.",
            "Voting: The k neighbors vote. Majority wins.",
            "k should usually be an odd number to avoid tied votes."
          ],
          advanced: [
            "Normalization: CRITICAL. If one attribute is 0-1000 and another is 0-1, the large one dominates the distance.",
            "Normalization formula: (value - min) / (max - min)."
          ],
          mastery: [
            "Curse of Dimensionality: In high dimensions (many attributes), everything is far apart, making kNN less effective.",
            "Weighted kNN: Closer neighbors can have a stronger vote than far ones.",
            "k=1 overfits (sensitive to noise). High k underfits (smoothes too much)."
          ]
        },
        quizQuestions: [
          { id: 1, question: "kNN is often referred to as what type of learning?", options: ["Eager Learning", "Lazy Learning", "Deep Learning", "Reinforcement Learning"], correct: 1, explanation: "kNN is 'Lazy' because it delays processing until classification is needed." },
          { id: 2, question: "Why is normalisation important in kNN?", options: ["It isn't important", "To make data smaller", "To prevent large-range attributes from dominating distance", "To convert text to numbers"], correct: 2, explanation: "Without normalisation, an attribute ranging 0-1000 would overpower one ranging 0-1." },
          { id: 3, question: "Which distance metric is standard for continuous attributes?", options: ["Manhattan", "Euclidean", "Hamming", "Cosine"], correct: 1, explanation: "Euclidean distance (straight-line) is standard for continuous 2D/3D spaces." }
        ]
      },
      {
        id: "dm_lec6",
        title: "Covering Algorithms",
        description: "Lecture 6: PRISM & Modular Rules",
        availableActivities: ['quiz'],
        learnContent: {
          beginner: [
            "Generates 'If-Then' rules.",
            "Different from Trees (Divide and Conquer).",
            "Covering uses 'Separate and Conquer'."
          ],
          intermediate: [
            "Strategy: Find a rule that covers some positive examples. Remove those examples. Repeat until all positives are covered.",
            "PRISM is a specific covering algorithm."
          ],
          advanced: [
            "PRISM Search: Starts with an empty rule. Adds tests (e.g., 'Humidity = High') that maximize accuracy (p/t).",
            "Unlike ID3, PRISM focuses on one class at a time."
          ],
          mastery: [
            "Modular Knowledge: Rules are independent 'nuggets'.",
            "Order matters: Usually executed as a decision list (Rule 1, else Rule 2, else...).",
            "This approach avoids the 'Replicated Subtree' problem found in Decision Trees."
          ]
        },
        quizQuestions: [
          { id: 1, question: "What strategy does PRISM use?", options: ["Divide and Conquer", "Separate and Conquer", "Gradient Descent", "Backpropagation"], correct: 1, explanation: "Covering algorithms use 'Separate and Conquer': find a rule, remove covered examples, and repeat." },
          { id: 2, question: "What is the output of PRISM?", options: ["A Decision Tree", "A set of 'If-Then' rules", "A Neural Network", "A Cluster map"], correct: 1, explanation: "PRISM produces a modular set of rules rather than a tree structure." },
          { id: 3, question: "If rules are independent, does the order of execution matter?", options: ["Yes, critically", "No, they can be executed in any order", "Only for numeric data", "Only if they conflict"], correct: 1, explanation: "Generally, rule sets (like decision lists) are ordered. If independent, order matters less, but PRISM typically produces an ordered list (Else...)." }
        ]
      },
      {
        id: "dm_lec7",
        title: "Decision Trees (ID3)",
        description: "Lecture 7: Entropy & Information Gain",
        availableActivities: ['quiz', 'entropylab'],
        learnContent: {
          beginner: [
            "Builds a Flowchart-like tree.",
            "Nodes are Questions (tests). Branches are Answers. Leaves are Classes.",
            "Uses 'Divide and Conquer'."
          ],
          intermediate: [
            "Goal: Create pure subsets (all Yes or all No).",
            "Entropy: A measure of impurity/disorder.",
            "0 Entropy = Perfectly Pure. 1 Entropy = Perfectly Mixed (50/50)."
          ],
          advanced: [
            "Information Gain: The reduction in Entropy caused by splitting on an attribute.",
            "ID3 chooses the attribute with the highest Information Gain at each step."
          ],
          mastery: [
            "Bias: ID3 prefers shorter trees (Search Bias).",
            "Flaw: ID3 prefers attributes with many possible values (like ID code). This creates many branches but generalizes poorly. (Fixed by Gain Ratio in C4.5)."
          ]
        },
        quizQuestions: [
          { id: 1, question: "ID3 constructs trees using which approach?", options: ["Bottom-Up", "Top-Down Induction", "Random Forest", "Evolutionary"], correct: 1, explanation: "ID3 builds the tree from the top down, selecting the best attribute at each step." },
          { id: 2, question: "What metric does ID3 use to select the best attribute?", options: ["Accuracy", "Information Gain", "Gini Impurity", "Standard Deviation"], correct: 1, explanation: "ID3 calculates Information Gain (reduction in Entropy) to decide splits." },
          { id: 3, question: "Entropy is a measure of...", options: ["Purity/Impurity", "Distance", "Accuracy", "Size"], correct: 0, explanation: "Entropy measures the impurity or disorder in a set of examples (0 = pure, 1 = mixed 50/50)." }
        ]
      },
      {
        id: "dm_lec9",
        title: "Towards C4.5 & J48",
        description: "Lecture 9: Handling Noise & Numerics",
        availableActivities: ['quiz'],
        learnContent: {
          beginner: [
            "C4.5 is the successor to ID3.",
            "J48 is simply the Java version of C4.5 used in Weka.",
            "It is robust and handles real-world messy data."
          ],
          intermediate: [
            "New Feature 1: Numeric Attributes (splits like 'Temperature > 75').",
            "New Feature 2: Missing Values (doesn't crash like ID3)."
          ],
          advanced: [
            "Handling Missing Values: C4.5 sends a 'fraction' of the instance down each branch, weighted by the popularity of that branch.",
            "Pruning: C4.5 cuts off branches that don't add enough accuracy to prevent overfitting."
          ],
          mastery: [
            "Gain Ratio: C4.5 uses Gain Ratio instead of Information Gain.",
            "This fixes ID3's bias towards attributes with many values (like ID codes) by penalizing splits that create too many tiny branches."
          ]
        },
        quizQuestions: [
          { id: 1, question: "What is a major improvement of C4.5 over ID3?", options: ["It is slower", "It handles numeric attributes and missing values", "It uses less memory", "It only works on binary data"], correct: 1, explanation: "C4.5 extends ID3 to handle continuous (numeric) data and missing attribute values." },
          { id: 2, question: "What is J48?", options: ["A Java implementation of C4.5", "A new algorithm", "A Python library", "A database"], correct: 0, explanation: "J48 is the Weka (Java) implementation of the standard C4.5 algorithm." },
          { id: 3, question: "How does C4.5 handle missing values?", options: ["Deletes the instance", "Assigns the most common value", "Fractionally distributes instances down branches", "Stops training"], correct: 2, explanation: "It sends a fraction of the instance down each branch proportional to the known data distribution." }
        ]
      },
      {
        id: "dm_lec10",
        title: "Evaluating Results",
        description: "Lecture 10: Accuracy & Confusion Matrices",
        availableActivities: ['quiz', 'matrixlab'],
        learnContent: {
          beginner: [
            "We can't just trust the model. We must test it.",
            "Accuracy = How many we got right / Total.",
            "Error Rate = 1 - Accuracy."
          ],
          intermediate: [
            "Confusion Matrix: A table showing correct and incorrect predictions.",
            "TP (True Positive), TN (True Negative), FP (False Positive), FN (False Negative)."
          ],
          advanced: [
            "Accuracy Paradox: If 99% of people are healthy, a model that says 'Everyone is Healthy' is 99% accurate but useless.",
            "This is why we need Precision and Recall."
          ],
          mastery: [
            "Precision: Of the ones we labeled positive, how many were actually positive?",
            "Recall: Of the actual positives, how many did we find?",
            "F-Measure: The harmonic mean of Precision and Recall."
          ]
        },
        quizQuestions: [
          { id: 1, question: "In a confusion matrix, what is a 'Type I Error'?", options: ["False Negative", "False Positive", "True Negative", "True Positive"], correct: 1, explanation: "A False Positive (hallucination) is often called a Type I error." },
          { id: 2, question: "What is the formula for Predictive Accuracy?", options: ["(TP + TN) / Total", "TP / (TP + FP)", "TP / (TP + FN)", "(FP + FN) / Total"], correct: 0, explanation: "Accuracy is the ratio of ALL correct predictions (Positives + Negatives) to the total." },
          { id: 3, question: "If your model predicts everyone is healthy, but 1% have a disease, accuracy is...", options: ["0%", "1%", "99%", "50%"], correct: 2, explanation: "Accuracy is 99%, but the model is useless for diagnosis. This is why we need Precision/Recall." }
        ]
      },
      {
        id: "dm_lec11",
        title: "Cross Validation",
        description: "Lecture 11: k-Fold & Stratification",
        availableActivities: ['quiz'],
        learnContent: {
          beginner: [
            "Never test on the training data!",
            "Holdout method: Split data into Train (e.g. 70%) and Test (30%).",
            "But what if we get a 'lucky' split?"
          ],
          intermediate: [
            "k-Fold Cross Validation: Split data into k parts.",
            "Train on k-1, Test on 1. Repeat k times.",
            "Average the k results."
          ],
          advanced: [
            "Stratification: Ensuring the class distribution is the same in every fold.",
            "If the original data is 70% Yes, every fold should be 70% Yes."
          ],
          mastery: [
            "Standard is 10-fold Stratified Cross Validation.",
            "Leave-One-Out (LOO): k = N. Useful for very small datasets, but computationally very expensive."
          ]
        },
        quizQuestions: [
          { id: 1, question: "What is the main advantage of k-Fold Cross Validation?", options: ["It is faster", "It uses all data for training and testing eventually", "It requires no training", "It works only on images"], correct: 1, explanation: "k-Fold ensures every data point appears in a test set exactly once, reducing bias." },
          { id: 2, question: "What does 'Stratified' mean?", options: ["Random sampling", "Ensuring class proportions are preserved", "Using only top data", "Sorting by date"], correct: 1, explanation: "Stratification ensures that if 30% of data is 'Yes', each fold also has ~30% 'Yes'." }
        ]
      },
      {
        id: "dm_lec12",
        title: "Confidence Intervals",
        description: "Lecture 12: Statistics of Evaluation",
        availableActivities: ['quiz'],
        learnContent: {
          beginner: [
            "An accuracy score (e.g., 85%) is just an estimate.",
            "Confidence Intervals tell us how sure we are (e.g., 85% ± 2%)."
          ],
          intermediate: [
            "Bernoulli Process: Classification is like flipping a coin (Correct/Incorrect).",
            "We use the Binomial Distribution."
          ],
          advanced: [
            "For large datasets, the Binomial distribution looks like a Normal (Gaussian) distribution (Bell curve).",
            "This allows us to use standard Z-scores (e.g., 1.96 for 95% confidence)."
          ],
          mastery: [
            "Formula: p ± z * sqrt( (p(1-p)) / N ).",
            "Smaller N (less data) -> Wider interval (Less confidence).",
            "Assumes independent samples."
          ]
        },
        quizQuestions: [
          { id: 1, question: "Prediction errors can be modeled using which process?", options: ["Bernoulli Process", "Poisson Process", "Random Walk", "Markov Chain"], correct: 0, explanation: "A success/failure outcome (correct/incorrect prediction) is effectively a Bernoulli process." },
          { id: 2, question: "For large datasets, the Binomial distribution can be approximated by...", options: ["The Normal (Gaussian) distribution", "The Uniform distribution", "The Exponential distribution", "The Gamma distribution"], correct: 0, explanation: "When N is large, the Normal distribution is a good approximation for the Binomial distribution." }
        ]
      },
      {
        id: "dm_lec13",
        title: "Applications",
        description: "Lecture 13: Real-World Use Cases",
        availableActivities: ['quiz'],
        learnContent: {
          beginner: [
            "Data Mining is used everywhere: Loans, Supermarkets, Engineering.",
            "Loan Applications: Classify 'Risk' vs 'Safe'."
          ],
          intermediate: [
            "Market Basket Analysis: Finding items bought together (Association Rules).",
            "Example: 'People who buy Bread often buy Butter'."
          ],
          advanced: [
            "Load Forecasting: Predicting electricity demand.",
            "This is a Regression task (predicting a number), not Classification.",
            "Input attributes include Temperature, Humidity, Wind."
          ],
          mastery: [
            "Fault Diagnosis: Detecting machine failures.",
            "Challenges: Data is often numeric sensor data. Anomalies (faults) are very rare (Class Imbalance)."
          ]
        },
        quizQuestions: [
          { id: 1, question: "Market Basket Analysis is typically associated with...", options: ["Clustering", "Association Rules", "Classification", "Regression"], correct: 1, explanation: "It finds items that occur together in transactions (e.g. 'If Bread then Butter')." },
          { id: 2, question: "In the Load Forecasting example, the class attribute was...", options: ["Nominal (Sunny/Rainy)", "Numeric (Energy Load)", "Boolean (High/Low)", "Text"], correct: 1, explanation: "It was a regression task predicting a numeric value (difference in load)." }
        ]
      },
      {
        id: "dm_lec14",
        title: "Clustering",
        description: "Lecture 14: Unsupervised Learning",
        availableActivities: ['quiz'],
        learnContent: {
          beginner: [
            "Unsupervised Learning: The data has NO labels/classes.",
            "Goal: Group similar items together."
          ],
          intermediate: [
            "k-Means: The most popular clustering algorithm.",
            "Step 1: Pick k random centers.",
            "Step 2: Assign points to nearest center.",
            "Step 3: Move center to average of points. Repeat."
          ],
          advanced: [
            "Choosing k: You must decide 'k' beforehand. If you pick wrong, results are bad.",
            "Outliers can pull the centroid away, ruining the cluster."
          ],
          mastery: [
            "Types of Clustering: Exclusive (k-means), Overlapping (Fuzzy), Hierarchical.",
            "Local Optima: k-Means is sensitive to initial random seeds. It might get stuck in a bad solution."
          ]
        },
        quizQuestions: [
          { id: 1, question: "Clustering is a form of...", options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Semi-supervised Learning"], correct: 1, explanation: "Clustering algorithms find patterns in data without pre-labeled classes." },
          { id: 2, question: "In k-Means clustering, what does 'k' represent?", options: ["The number of iterations", "The number of clusters", "The distance metric", "The number of outliers"], correct: 1, explanation: "You must pre-specify 'k', the number of clusters (centroids) the algorithm should find." }
        ]
      },
      {
        id: "dm_lec15",
        title: "Concept Descriptions",
        description: "Lecture 15: Bias & Pruning",
        availableActivities: ['quiz'],
        learnContent: {
          beginner: [
            "Models can be viewed as 'Search'.",
            "We search through all possible trees/rules to find the best one.",
            "We want to avoid Overfitting (memorizing noise)."
          ],
          intermediate: [
            "Pre-pruning: Stop building the tree early.",
            "Post-pruning: Build the full tree, then cut off useless branches.",
            "Post-pruning is generally better."
          ],
          advanced: [
            "Inductive Bias: Assumptions made by the algorithm to choose one model over another.",
            "Search Bias: Preference for the search order (e.g., ID3 prefers simple trees).",
            "Language Bias: Constraints on what can be represented (e.g., 1R can only use 1 attribute)."
          ],
          mastery: [
            "Replicated Subtree Problem: Disjunctive concepts (A OR B) cause trees to duplicate logic.",
            "Rules vs Trees: Rules are often more modular and avoid replication.",
            "Generalization as Search: The concept space is huge; heuristics direct the search."
          ]
        },
        quizQuestions: [
          { id: 1, question: "What is 'Post-pruning'?", options: ["Simplifying while growing the tree", "Growing a full tree then simplifying it", "Removing data before training", "Ignoring attributes"], correct: 1, explanation: "Post-pruning allows the model to capture complex patterns first, then removes insignificant parts to avoid overfitting." },
          { id: 2, question: "Preference for simpler hypotheses is an example of...", options: ["Search Bias", "Language Bias", "Confirmation Bias", "Selection Bias"], correct: 0, explanation: "Search bias determines *how* the algorithm searches the space (e.g., preferring simpler trees)." }
        ]
      }
    ]
  }
];

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 shadow-slate-900/20 dark:bg-slate-700 dark:hover:bg-slate-600 bg-gray-200 hover:bg-gray-300 text-gray-900 dark:text-white",
    success: "bg-green-600 hover:bg-green-500 text-white shadow-green-900/20",
    danger: "bg-red-500 hover:bg-red-400 text-white shadow-red-900/20",
    outline: "border-2 border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
  };
  
  return (
    <button disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

const Card = ({ children, title, className = '' }: any) => (
  <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all ${className}`}>
    {title && <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{title}</h3>}
    {children}
  </div>
);

// --- Learn Mode Component ---

const LearnSection = ({ content, onBack }: { content: LearnContent, onBack: () => void }) => {
  const [level, setLevel] = useState<LearnLevel>('beginner');

  const levels: LearnLevel[] = ['beginner', 'intermediate', 'advanced', 'mastery'];
  
  const levelColors = {
    beginner: "bg-green-500",
    intermediate: "bg-blue-500",
    advanced: "bg-purple-500",
    mastery: "bg-orange-500"
  };

  const currentPoints = content[level];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-100 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`flex-1 py-3 px-6 rounded-xl capitalize font-bold transition-all ${
              level === l 
                ? `${levelColors[l]} text-white shadow-lg scale-105` 
                : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <Card className="min-h-[400px] relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full ${levelColors[level]}`}></div>
        
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className={`w-8 h-8 ${levelColors[level].replace("bg-", "text-")}`} />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{level} Concepts</h2>
          </div>
        </div>

        <div className="space-y-6">
          {currentPoints.map((point, idx) => (
            <div key={idx} className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-blue-300 transition-colors">
              <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${levelColors[level]} text-white`}>
                {idx + 1}
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <Button onClick={onBack} variant="outline">Back to Menu</Button>
        </div>
      </Card>
    </div>
  );
};

// --- Activity Components ---

const QuizArena = ({ data, onBack }: { data: Question[], onBack: () => void }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (index: number) => {
    const isCorrect = index === data[currentQ].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setLastAnswerCorrect(isCorrect);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (currentQ < data.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="text-8xl mb-4 drop-shadow-2xl">🏆</div>
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Quiz Complete!</h2>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-[300px] shadow-xl">
          <div className="text-slate-500 dark:text-slate-400 mb-2">Final Score</div>
          <div className="text-5xl font-bold text-blue-500 mb-4">{score} / {data.length}</div>
        </div>
        <Button onClick={onBack}>Back to Topic</Button>
      </div>
    );
  }

  const q = data[currentQ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center text-sm font-bold text-slate-500 dark:text-slate-400">
        <span>Question {currentQ + 1} of {data.length}</span>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${((currentQ) / data.length) * 100}%` }}></div>
      </div>

      <Card className="min-h-[300px] flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">{q.question}</h2>
        {!showExplanation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-600 hover:scale-105 transition-all text-slate-800 dark:text-slate-100 font-semibold border border-slate-200 dark:border-slate-600 hover:border-blue-400 text-left relative overflow-hidden group"
              >
                <span className="relative z-10">{opt}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={`text-center space-y-4 animate-in fade-in zoom-in ${lastAnswerCorrect ? 'text-green-500' : 'text-red-500'}`}>
            <div className="text-6xl mb-2 flex justify-center">
              {lastAnswerCorrect ? <div className="bg-green-100 dark:bg-green-500/20 p-4 rounded-full"><Check className="w-16 h-16"/></div> : <div className="bg-red-100 dark:bg-red-500/20 p-4 rounded-full"><X className="w-16 h-16"/></div>}
            </div>
            <h3 className="text-2xl font-bold">{lastAnswerCorrect ? "Correct!" : "Incorrect"}</h3>
            <p className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 text-lg leading-relaxed">{q.explanation}</p>
            <Button onClick={nextQuestion} className="w-full mt-4" variant={lastAnswerCorrect ? 'success' : 'secondary'}>
              Next Question
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

const TruthLab = ({ onBack }: { onBack: () => void }) => {
  const [p, setP] = useState(true);
  const [q, setQ] = useState(true);

  const negP = !p;
  const and = p && q;
  const or = p || q;
  const implies = !p || q;
  const iff = p === q;

  const LogicRow = ({ label, symbol, value, desc }: any) => (
    <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors duration-300 ${value ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/50' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/50'}`}>
      <div className="flex flex-col">
        <span className="text-slate-500 dark:text-slate-400 text-xs font-mono mb-1">{desc}</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-200 w-8">{symbol}</span>
          <span className="font-semibold text-slate-900 dark:text-white">{label}</span>
        </div>
      </div>
      <div className={`px-4 py-2 rounded-lg font-mono font-bold ${value ? 'text-green-600 dark:text-green-400 bg-green-200 dark:bg-green-900/30' : 'text-red-600 dark:text-red-400 bg-red-200 dark:bg-red-900/30'}`}>
        {value ? 'TRUE' : 'FALSE'}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card title="Inputs">
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-4 rounded-xl">
                <span className="text-2xl font-bold text-blue-500">p</span>
                <button onClick={() => setP(!p)} className="transition-transform active:scale-95">
                  {p ? <ToggleRight className="w-12 h-12 text-green-500"/> : <ToggleLeft className="w-12 h-12 text-slate-400"/>}
                </button>
              </div>
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-4 rounded-xl">
                <span className="text-2xl font-bold text-purple-500">q</span>
                <button onClick={() => setQ(!q)} className="transition-transform active:scale-95">
                  {q ? <ToggleRight className="w-12 h-12 text-green-500"/> : <ToggleLeft className="w-12 h-12 text-slate-400"/>}
                </button>
              </div>
            </div>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="grid gap-3">
             <LogicRow symbol="¬p" label="Negation" value={negP} desc="NOT p (Flips p)" />
             <LogicRow symbol="p ∧ q" label="Conjunction" value={and} desc="AND (Both must be True)" />
             <LogicRow symbol="p ∨ q" label="Disjunction" value={or} desc="OR (Inclusive - at least one True)" />
             <LogicRow symbol="p ⇒ q" label="Implication" value={implies} desc="IF p THEN q (Only False if T ⇒ F)" />
             <LogicRow symbol="p ⇔ q" label="Equivalence" value={iff} desc="IFF (Both same value)" />
          </div>
        </div>
      </div>
    </div>
  );
};

const MatrixLab = ({ onBack }: { onBack: () => void }) => {
  const [values, setValues] = useState({ tp: 50, tn: 40, fp: 5, fn: 5 });

  const total = values.tp + values.tn + values.fp + values.fn;
  const accuracy = total > 0 ? ((values.tp + values.tn) / total * 100).toFixed(1) : "0";
  const precision = (values.tp + values.fp) > 0 ? (values.tp / (values.tp + values.fp) * 100).toFixed(1) : "0";
  const recall = (values.tp + values.fn) > 0 ? (values.tp / (values.tp + values.fn) * 100).toFixed(1) : "0";

  const handleChange = (key: string, val: string) => {
    setValues({ ...values, [key]: parseInt(val) || 0 });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Confusion Matrix Inputs">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg border border-green-300 dark:border-green-500/30">
              <label className="block text-sm text-green-600 dark:text-green-400 font-bold mb-2">True Positive (TP)</label>
              <input type="number" value={values.tp} onChange={(e) => handleChange('tp', e.target.value)} className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-lg border border-slate-300 dark:border-slate-700"/>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg border border-red-300 dark:border-red-500/30">
              <label className="block text-sm text-red-600 dark:text-red-400 font-bold mb-2">False Positive (FP)</label>
              <input type="number" value={values.fp} onChange={(e) => handleChange('fp', e.target.value)} className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-lg border border-slate-300 dark:border-slate-700"/>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg border border-red-300 dark:border-red-500/30">
              <label className="block text-sm text-red-600 dark:text-red-400 font-bold mb-2">False Negative (FN)</label>
              <input type="number" value={values.fn} onChange={(e) => handleChange('fn', e.target.value)} className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-lg border border-slate-300 dark:border-slate-700"/>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg border border-green-300 dark:border-green-500/30">
              <label className="block text-sm text-green-600 dark:text-green-400 font-bold mb-2">True Negative (TN)</label>
              <input type="number" value={values.tn} onChange={(e) => handleChange('tn', e.target.value)} className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-lg border border-slate-300 dark:border-slate-700"/>
            </div>
          </div>
          <div className="mt-4 text-center text-slate-500 text-sm">Total Instances: {total}</div>
        </Card>

        <div className="space-y-4">
          <Card title="Calculated Metrics" className="h-full flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700 dark:text-slate-300">Accuracy</span>
                  <span className="font-bold text-slate-900 dark:text-white">{accuracy}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${accuracy}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">(TP + TN) / Total</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700 dark:text-slate-300">Precision</span>
                  <span className="font-bold text-slate-900 dark:text-white">{precision}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                  <div className="bg-purple-500 h-4 rounded-full transition-all duration-500" style={{ width: `${precision}%` }}></div>
                </div>
                 <p className="text-xs text-slate-500 mt-1">TP / (TP + FP) — "How many selected items are relevant?"</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700 dark:text-slate-300">Recall</span>
                  <span className="font-bold text-slate-900 dark:text-white">{recall}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                  <div className="bg-orange-500 h-4 rounded-full transition-all duration-500" style={{ width: `${recall}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">TP / (TP + FN) — "How many relevant items are selected?"</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const KNNVisualizer = ({ onBack }: { onBack: () => void }) => {
  const [queryPoint, setQueryPoint] = useState<{x: number, y: number} | null>(null);
  
  // Hardcoded training data
  const dataPoints = [
    { x: 10, y: 80, class: 'A', color: 'bg-red-500' },
    { x: 20, y: 70, class: 'A', color: 'bg-red-500' },
    { x: 25, y: 85, class: 'A', color: 'bg-red-500' },
    { x: 15, y: 60, class: 'A', color: 'bg-red-500' },
    { x: 70, y: 20, class: 'B', color: 'bg-blue-500' },
    { x: 80, y: 30, class: 'B', color: 'bg-blue-500' },
    { x: 75, y: 15, class: 'B', color: 'bg-blue-500' },
    { x: 60, y: 25, class: 'B', color: 'bg-blue-500' },
    { x: 40, y: 50, class: 'A', color: 'bg-red-500' }, // Outlierish
    { x: 50, y: 40, class: 'B', color: 'bg-blue-500' }, // Outlierish
  ];

  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setQueryPoint({ x, y });
  };

  const calculateNeighbors = () => {
    if (!queryPoint) return [];
    const distances = dataPoints.map((pt, idx) => ({
      ...pt,
      idx,
      dist: Math.sqrt(Math.pow(pt.x - queryPoint.x, 2) + Math.pow(pt.y - queryPoint.y, 2))
    }));
    return distances.sort((a, b) => a.dist - b.dist);
  };

  const neighbors = calculateNeighbors();
  const getWinner = (k: number) => {
    if (!neighbors.length) return "?";
    const slice = neighbors.slice(0, k);
    const aCount = slice.filter(n => n.class === 'A').length;
    const bCount = slice.filter(n => n.class === 'B').length;
    return aCount > bCount ? "Red (A)" : "Blue (B)";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="kNN Playground" className="md:col-span-2 min-h-[400px]">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Click anywhere in the box to place a Test Point (Green).</p>
          <div 
            onClick={handleAreaClick}
            className="w-full h-[300px] bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 relative cursor-crosshair overflow-hidden"
          >
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Data Points */}
            {dataPoints.map((pt, i) => (
              <div 
                key={i} 
                className={`absolute w-4 h-4 rounded-full ${pt.color} shadow-lg transform -translate-x-1/2 -translate-y-1/2 border border-white/20`}
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              />
            ))}

            {/* Query Point */}
            {queryPoint && (
              <div 
                className="absolute w-5 h-5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] transform -translate-x-1/2 -translate-y-1/2 border-2 border-white animate-pulse"
                style={{ left: `${queryPoint.x}%`, top: `${queryPoint.y}%` }}
              />
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="Classification Results">
            {!queryPoint ? (
              <div className="text-slate-500 text-center py-10 italic">Place a point to see results</div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">1-Nearest Neighbour</div>
                  <div className={`text-xl font-bold ${getWinner(1).includes('Red') ? 'text-red-500' : 'text-blue-500'}`}>
                    {getWinner(1)}
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">3-Nearest Neighbour</div>
                   <div className={`text-xl font-bold ${getWinner(3).includes('Red') ? 'text-red-500' : 'text-blue-500'}`}>
                    {getWinner(3)}
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">5-Nearest Neighbour</div>
                   <div className={`text-xl font-bold ${getWinner(5).includes('Red') ? 'text-red-500' : 'text-blue-500'}`}>
                    {getWinner(5)}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

const BayesCalculator = ({ onBack }: { onBack: () => void }) => {
  const [prior, setPrior] = useState(0.3); // P(H)
  const [likelihood, setLikelihood] = useState(0.8); // P(E|H)
  const [evidence, setEvidence] = useState(0.4); // P(E)

  const posterior = (likelihood * prior) / evidence;
  const posteriorDisplay = isNaN(posterior) || !isFinite(posterior) ? "---" : (posterior > 1 ? "1.00 (Cap)" : posterior.toFixed(4));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="Bayes Theorem Calculator">
        <div className="text-center mb-6 bg-slate-100 dark:bg-slate-900 p-4 rounded-xl font-mono text-lg text-blue-600 dark:text-blue-300">
          P(H|E) = [ P(E|H) × P(H) ] / P(E)
        </div>

        <div className="space-y-6">
          <div>
             <div className="flex justify-between mb-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">Prior P(H)</label>
                <span className="text-blue-500">{prior.toFixed(2)}</span>
             </div>
             <input type="range" min="0.01" max="1" step="0.01" value={prior} onChange={(e) => setPrior(parseFloat(e.target.value))} className="w-full accent-blue-500"/>
             <p className="text-xs text-slate-500">Probability of Hypothesis before seeing evidence.</p>
          </div>

          <div>
             <div className="flex justify-between mb-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">Likelihood P(E|H)</label>
                <span className="text-green-500">{likelihood.toFixed(2)}</span>
             </div>
             <input type="range" min="0.01" max="1" step="0.01" value={likelihood} onChange={(e) => setLikelihood(parseFloat(e.target.value))} className="w-full accent-green-500"/>
             <p className="text-xs text-slate-500">Probability of Evidence assuming Hypothesis is true.</p>
          </div>

          <div>
             <div className="flex justify-between mb-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">Evidence P(E)</label>
                <span className="text-orange-500">{evidence.toFixed(2)}</span>
             </div>
             <input type="range" min="0.01" max="1" step="0.01" value={evidence} onChange={(e) => setEvidence(parseFloat(e.target.value))} className="w-full accent-orange-500"/>
             <p className="text-xs text-slate-500">Total probability of the Evidence occurring.</p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <div className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Posterior Probability P(H|E)</div>
            <div className="text-5xl font-bold text-slate-900 dark:text-white text-shadow-lg">{posteriorDisplay}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const EntropyLab = ({ onBack }: { onBack: () => void }) => {
  const [pos, setPos] = useState(9);
  const [neg, setNeg] = useState(5);

  const total = pos + neg;
  const p_pos = total === 0 ? 0 : pos / total;
  const p_neg = total === 0 ? 0 : neg / total;

  // H(S) = -p+log2(p+) - p-log2(p-)
  const entropy = total === 0 ? 0 : (
    (p_pos === 0 ? 0 : -p_pos * Math.log2(p_pos)) + 
    (p_neg === 0 ? 0 : -p_neg * Math.log2(p_neg))
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="Entropy Calculator (Information Gain)">
        <p className="text-slate-600 dark:text-slate-400 mb-6">Visualise the "purity" of a dataset. 
          <br/>Entropy is 0 when the set is pure (all Yes or all No).
          <br/>Entropy is 1 when the set is perfectly mixed (50/50).
        </p>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">{pos}</div>
            <div className="flex justify-center gap-4 mb-2">
              <button onClick={() => setPos(Math.max(0, pos-1))} className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white">-</button>
              <button onClick={() => setPos(pos+1)} className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white">+</button>
            </div>
            <div className="uppercase text-xs font-bold text-slate-500">Positive Examples</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">{neg}</div>
            <div className="flex justify-center gap-4 mb-2">
              <button onClick={() => setNeg(Math.max(0, neg-1))} className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white">-</button>
              <button onClick={() => setNeg(neg+1)} className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white">+</button>
            </div>
             <div className="uppercase text-xs font-bold text-slate-500">Negative Examples</div>
          </div>
        </div>

        {/* Visual Bar */}
        <div className="h-6 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex mb-8">
          <div style={{ width: `${(p_pos * 100)}%` }} className="h-full bg-green-500 transition-all duration-500"></div>
          <div style={{ width: `${(p_neg * 100)}%` }} className="h-full bg-red-500 transition-all duration-500"></div>
        </div>

        <div className="text-center bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="text-sm uppercase tracking-widest text-slate-500 mb-2">Entropy (Bits)</div>
          <div className="text-6xl font-bold text-slate-900 dark:text-white">{entropy.toFixed(3)}</div>
        </div>
      </Card>
    </div>
  );
};

const Translator = ({ data, onBack }: { data: TranslationChallenge[], onBack: () => void }) => {
  const [level, setLevel] = useState(0);
  const [builtFormula, setBuiltFormula] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!data || data.length === 0) return <div className="text-center p-10 text-slate-400">No translation challenges available yet.</div>;

  const challenge = data[level];

  const addToFormula = (token: string) => {
    setBuiltFormula([...builtFormula, token]);
    setErrorMsg('');
  };

  const removeLast = () => {
    setBuiltFormula(builtFormula.slice(0, -1));
    setErrorMsg('');
  };

  const checkAnswer = () => {
    const userStr = builtFormula.join('');
    const correctStr = challenge.correctFormula.join('');
    if (userStr === correctStr) {
      setIsSuccess(true);
      new Audio('https://api.freesound.org/v2/sounds/536108/download/').play().catch(()=> {});
    } else {
      setErrorMsg("Not quite. Check your syntax and brackets!");
    }
  };

  const nextLevel = () => {
    if (level < data.length - 1) {
      setLevel(level + 1);
      setBuiltFormula([]);
      setIsSuccess(false);
      setErrorMsg('');
    } else {
      setLevel(0);
      setBuiltFormula([]);
      setIsSuccess(false);
      onBack();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="min-h-[400px]">
        {!isSuccess ? (
          <>
            <div className="mb-8">
              <h2 className="text-xl text-slate-700 dark:text-slate-300 font-medium mb-2">Translate this sentence:</h2>
              <p className="text-2xl font-serif italic text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                "{challenge.sentence}"
              </p>
              <div className="mt-4 flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                {Object.entries(challenge.variables).map(([key, val]) => (
                  <span key={key} className="bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600">
                    <strong className="text-yellow-600 dark:text-yellow-400">{key}</strong> = {val}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 min-h-[80px] flex items-center gap-2 mb-6 border-2 border-slate-200 dark:border-slate-700 flex-wrap">
               {builtFormula.length === 0 && <span className="text-slate-500 italic">Click tokens below to build formula...</span>}
               {builtFormula.map((token, i) => (
                 <span key={i} className="bg-blue-600 px-3 py-2 rounded-lg font-mono font-bold text-lg animate-in fade-in slide-in-from-bottom-2 text-white">
                   {token}
                 </span>
               ))}
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {challenge.tokens.map((token) => (
                  <button
                    key={token}
                    onClick={() => addToFormula(token)}
                    className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-mono font-bold text-xl shadow-lg border-b-4 border-slate-300 dark:border-slate-800 active:border-b-0 active:translate-y-1 transition-all"
                  >
                    {token}
                  </button>
                ))}
                <button onClick={removeLast} className="px-4 h-12 rounded-lg bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 text-red-600 dark:text-red-200 border border-red-300 dark:border-red-800 ml-4">
                  Delete
                </button>
              </div>

              {errorMsg && <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-2 rounded animate-pulse">{errorMsg}</div>}

              <Button onClick={checkAnswer} className="w-full">Check Formula</Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-green-500/50 shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Spot on!</h2>
            <div className="text-slate-600 dark:text-slate-300">
              <p>The correct formula is indeed:</p>
              <p className="text-2xl font-mono text-blue-500 mt-2 tracking-wider">{challenge.correctFormula.join(' ')}</p>
            </div>
            <Button onClick={nextLevel} variant="success">Next Challenge</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

const Classifier = ({ onBack }: { onBack: () => void }) => {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const problems = [
    { formula: "p ∨ ¬p", type: "Tautology", explain: "It's always true. Either p is true OR it isn't. One must be true." },
    { formula: "p ∧ ¬p", type: "Contradiction", explain: "Always false. You cannot be both p AND not p at the same time." },
    { formula: "p ⇒ ¬p", type: "Contingent", explain: "Depends on p. If p is True, it's False. If p is False, it's True." },
    { formula: "p ⇒ p", type: "Tautology", explain: "If p is true, p is true. Always valid." },
  ];

  const handleGuess = (guess: string) => {
    if (guess === problems[index].type) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  const next = () => {
    setFeedback(null);
    if (index < problems.length - 1) setIndex(index + 1);
    else onBack();
  };

  const pbm = problems[index];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card className="text-center py-10">
        <h2 className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm font-bold mb-4">Classify this Proposition</h2>
        <div className="text-5xl font-mono text-slate-900 dark:text-white mb-10 bg-slate-100 dark:bg-slate-900 py-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
          {pbm.formula}
        </div>

        {feedback === null ? (
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={() => handleGuess("Tautology")} variant="secondary">Tautology (Always True)</Button>
            <Button onClick={() => handleGuess("Contradiction")} variant="secondary">Contradiction (Always False)</Button>
            <Button onClick={() => handleGuess("Contingent")} variant="secondary">Contingent (Depends)</Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className={`text-2xl font-bold ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
              {feedback === 'correct' ? "Correct!" : "Not quite..."}
            </div>
            <p className="text-slate-600 dark:text-slate-300">{pbm.explain}</p>
            <Button onClick={next} variant="primary">Next</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

// --- Main App Container ---

const App = () => {
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState<ActivityType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<Theme>('dark');

  // Helpers to get current data objects
  const currentModule = COURSE_CONTENT.find(m => m.id === activeModuleId);
  const currentTopic = currentModule?.topics.find(t => t.id === activeTopicId);

  // Search Logic
  const filteredTopics = useMemo(() => {
    if (!searchQuery) return [];
    const results: { topic: TopicContent, moduleId: string }[] = [];
    COURSE_CONTENT.forEach(mod => {
      mod.topics.forEach(topic => {
        if (topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            topic.description.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ topic, moduleId: mod.id });
        }
      });
    });
    return results;
  }, [searchQuery]);

  // Navigation Handlers
  const handleSelectTopic = (moduleId: string, topicId: string) => {
    setActiveModuleId(moduleId);
    setActiveTopicId(topicId);
    setViewState('topic-menu');
    setSearchQuery("");
  };

  const handleSelectActivity = (type: ActivityType) => {
    setActiveActivity(type);
    setViewState('activity');
  };

  const goHome = () => {
    setViewState('dashboard');
    setActiveModuleId(null);
    setActiveTopicId(null);
    setActiveActivity(null);
  };

  const goBackToTopic = () => {
    setViewState('topic-menu');
    setActiveActivity(null);
  };

  // --- Render Views ---

  const renderDashboard = () => (
    <div className="space-y-12">
      {/* Header Area */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Logic Loop</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Select a module to begin your training.</p>
      </div>

      {/* Global Search */}
      <div className="relative group max-w-2xl mx-auto mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search for 'Entropy', 'Truth Tables', 'k-Means'..." 
          className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {/* Search Results Dropdown */}
        {searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((res) => (
                <button 
                  key={res.topic.id}
                  onClick={() => handleSelectTopic(res.moduleId, res.topic.id)}
                  className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center justify-between group/item"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{res.topic.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{res.topic.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover/item:text-blue-500" />
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">No topics found matching "{searchQuery}"</div>
            )}
          </div>
        )}
      </div>

      {/* Modules Grid */}
      {!searchQuery && (
        <div className="grid gap-12">
          {COURSE_CONTENT.map((mod) => (
            <div key={mod.id} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <mod.icon className={`w-6 h-6 ${mod.color}`} />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">{mod.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mod.topics.length > 0 ? (
                  mod.topics.map((topic) => (
                    <button 
                      key={topic.id}
                      onClick={() => handleSelectTopic(mod.id, topic.id)}
                      className="group bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 hover:border-blue-500/50 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 shadow-lg hover:shadow-blue-900/10 flex flex-col h-full relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180" />
                      </div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-xl group-hover:bg-blue-600/20 group-hover:text-blue-500 transition-colors">
                          <BookOpen className="w-6 h-6 text-slate-400 dark:text-slate-400 group-hover:text-blue-500"/>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{topic.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-auto leading-relaxed">{topic.description}</p>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4"/> Content Locked or Coming Soon
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTopicMenu = () => {
    const topic = currentTopic;
    if (!topic) return null;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
        <div className="text-center mb-8">
          <span className="text-blue-500 font-bold uppercase tracking-wider text-xs">{currentModule?.title}</span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">{topic.title}</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">{topic.description}</p>
        </div>

        {/* Study Guide Banner */}
        <div className="max-w-4xl mx-auto mb-10">
          <button 
            onClick={() => setViewState('learn')}
            className="w-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-900/40 dark:to-purple-900/40 border border-blue-200 dark:border-blue-500/30 hover:border-blue-400 rounded-2xl p-8 transition-all group flex items-center justify-between shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center gap-6 relative z-10">
              <div className="bg-blue-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <School className="w-8 h-8 text-white"/>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Study Guide</h3>
                <p className="text-slate-600 dark:text-blue-200/80">Review concepts from Beginner to Mastery levels.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900/50 p-2 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors">
               <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white"/>
            </div>
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-300 mb-6 max-w-4xl mx-auto px-2">Interactive Labs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {topic.availableActivities.includes('quiz') && (
            <button onClick={() => handleSelectActivity('quiz')} className="group bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 shadow-xl">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-500 dark:text-blue-400">
                <RefreshCw className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Quiz Arena</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Test knowledge</p>
            </button>
          )}

          {topic.availableActivities.includes('truthlab') && (
            <button onClick={() => handleSelectActivity('truthlab')} className="group bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-purple-500 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 shadow-xl">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors text-purple-500 dark:text-purple-400">
                <ToggleRight className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Truth Lab</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Logic gates playground.</p>
            </button>
          )}

          {topic.availableActivities.includes('knnvis') && (
            <button onClick={() => handleSelectActivity('knnvis')} className="group bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-teal-500 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 shadow-xl">
              <div className="bg-teal-100 dark:bg-teal-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors text-teal-500 dark:text-teal-400">
                <Target className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">kNN Visualiser</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Drop points & see votes.</p>
            </button>
          )}

          {topic.availableActivities.includes('bayescalc') && (
            <button onClick={() => handleSelectActivity('bayescalc')} className="group bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 shadow-xl">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors text-indigo-500 dark:text-indigo-400">
                <Calculator className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Bayes Lab</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Probability calculator.</p>
            </button>
          )}

          {topic.availableActivities.includes('entropylab') && (
            <button onClick={() => handleSelectActivity('entropylab')} className="group bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-yellow-500 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 shadow-xl">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-600 group-hover:text-white transition-colors text-yellow-600 dark:text-yellow-400">
                <Sigma className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Entropy Engine</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Visualise Purity.</p>
            </button>
          )}

           {topic.availableActivities.includes('matrixlab') && (
            <button onClick={() => handleSelectActivity('matrixlab')} className="group bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-pink-500 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 shadow-xl">
              <div className="bg-pink-100 dark:bg-pink-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-600 group-hover:text-white transition-colors text-pink-500 dark:text-pink-400">
                <Activity className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Matrix Lab</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Confusion Matrix tool.</p>
            </button>
          )}

          {topic.availableActivities.includes('translator') && (
            <button onClick={() => handleSelectActivity('translator')} className="group bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-green-500 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 shadow-xl">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors text-green-600 dark:text-green-400">
                <Play className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Translator</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Convert sentences to logic.</p>
            </button>
          )}

          {topic.availableActivities.includes('classifier') && (
            <button onClick={() => handleSelectActivity('classifier')} className="group bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-orange-500 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 shadow-xl">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors text-orange-500 dark:text-orange-400">
                <Star className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">The Classifier</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Tautology vs Contradiction.</p>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme} min-h-screen`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-blue-500/30 pb-20 transition-colors duration-500">
        
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-300 hidden sm:block">
                Logic Loop
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400"/> : <Moon className="w-5 h-5 text-slate-600"/>}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8 relative min-h-[80vh]">
          
          {/* Background Decors */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
             <div className="absolute top-20 left-10 text-9xl font-serif text-slate-900 dark:text-white select-none">Σ</div>
             <div className="absolute bottom-20 right-10 text-9xl font-serif text-slate-900 dark:text-white select-none">x</div>
          </div>

          {/* Back Button for Sub-Views */}
          {(viewState === 'activity' || viewState === 'learn' || viewState === 'topic-menu') && (
            <button 
              onClick={viewState === 'topic-menu' ? goHome : goBackToTopic}
              className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors relative z-10 hover:-translate-x-1 duration-300"
            >
              <ArrowLeft className="w-4 h-4"/> 
              {viewState === 'topic-menu' ? 'Dashboard' : 'Back to Topic'}
            </button>
          )}

          <div className="relative z-10 transition-all duration-300">
            {viewState === 'dashboard' && renderDashboard()}
            {viewState === 'topic-menu' && renderTopicMenu()}
            
            {viewState === 'learn' && currentTopic && (
              <LearnSection 
                content={currentTopic.learnContent} 
                onBack={goBackToTopic} 
              />
            )}

            {viewState === 'activity' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                {activeActivity === 'quiz' && <QuizArena 
                  data={currentTopic?.quizQuestions || []} 
                  onBack={goBackToTopic} 
                />}
                {activeActivity === 'truthlab' && <TruthLab onBack={goBackToTopic} />}
                {activeActivity === 'matrixlab' && <MatrixLab onBack={goBackToTopic} />}
                {activeActivity === 'knnvis' && <KNNVisualizer onBack={goBackToTopic} />}
                {activeActivity === 'bayescalc' && <BayesCalculator onBack={goBackToTopic} />}
                {activeActivity === 'entropylab' && <EntropyLab onBack={goBackToTopic} />}
                {activeActivity === 'translator' && <Translator data={currentTopic?.translationChallenges || []} onBack={goBackToTopic} />}
                {activeActivity === 'classifier' && <Classifier onBack={goBackToTopic} />}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;