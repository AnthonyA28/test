---
title: How to make a VLE Diagram
layout: article_post
section: article
excerpt: Making a VLE entails applying a few simple formulas.
tags: ChemicalEngineering
toc: true
---

# How to Make a VLE Diagram

## Rault's Law
Rault's law states how the partial pressure of a gas is proportional to its concentration both within the gas and in the solution in equilibrium with the gas. 

$$
\begin{equation}
p_a = y_aP = x_ap^\ast_a(T)  \label{eq:one}
\end{equation} 
$$

where, $p_a$ is the partial pressure of component a; $y_a$ is the concentration of a in the gas; $P$ is the total pressure of the gas; $x_a$ is the concentration of a in the liquid; $p^{\ast}_a(T)$ is the a vapor pressure of pure a at temperature T.


## Dalton's Law
Dalton's law states that the sum of partial pressures is equal to the partial pressure. If a system contained two components: a and b , then the total pressure of the system would be: 

$$
\begin{equation}
P = p_a + p_b  \label{eq:two}
\end{equation} 
$$

where, $p_b$ is the partial pressure of component b.

## Antoine Equation
The Antoine equation allows one to solve for the vapor pressures of a component at different temperatures. It is an empirical relationship with constants found in the literature. 

$$
\begin{equation}
p^\ast(T) = 10^{[A - \frac{B}{C+T}]}  \label{eq:three}
\end{equation} 
$$

## Combining
If the partial pressures in Dalton's Law (equation \eqref{eq:one}) are substituted into Rault's Law (equation \eqref{eq:two}), the following equation is developed: 


$$
\begin{equation}
P = x_a p_{a}^{\ast} + x_b p_b^{\ast} \label{eq:four}
\end{equation} 
$$


 and since we just have two components we can say: 

$$
\begin{equation}
1 = x_a + x_b \label{eq:five}
\end{equation} 
$$
 

 Substituting equation \eqref{eq:five} into equation \eqref{eq:four} yields: 

 
$$
\begin{equation}
P = x_a p_a^{\ast} + (1-x_a) p_b ^{\ast} \label{eq:six}
\end{equation} 
$$
 
 


If equation \eqref{eq:six} is rearranged to isolate $x_a$, then is becomes: 



$$
\begin{equation}
x_a = \frac{P-p_b^{\ast}}{p_a^{\ast} - p_b^{\ast}} \label{eq:seven}
\end{equation} 
$$


Equation \eqref{eq:three} at a known T can be used to solve for $p_a$ and $p_b$. The temperatures to be used are those within the range of boiling points between the two components. Then $p_a$ and $p_b$ can be plugged into equation \eqref{eq:six} at a known P ( whatever your system is at - probably 1 atm) to solve for $x_a$. Then use equation \eqref{eq:five} to solve for $x_b$. Finally use equation \eqref{eq:one} to solve for $y_a$ and $y_b$.