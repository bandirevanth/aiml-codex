"""This modules contains data about visualisation page"""

# Import necessary modules
import warnings
import matplotlib.pyplot as plt
import seaborn as sns
'''from sklearn.metrics import plot_confusion_matrix'''
from sklearn import tree
import streamlit as st


# Import necessary functions from web_functions
from web_functions import train_model

def app(df, X, y):
    """This function create the visualisation page"""
    
    # Remove the warnings
    warnings.filterwarnings('ignore')
    st.set_option('deprecation.showPyplotGlobalUse', False)

    # Set the page title
    st.title("Visualise the Stress Level")

    # Create a checkbox to show correlation heatmap
    if st.checkbox("Show the correlation heatmap"):
        st.subheader("Correlation Heatmap")

        fig = plt.figure(figsize = (10, 6))
        ax = sns.heatmap(df.iloc[:, 1:].corr(), annot = True)   # Creating an object of seaborn axis and storing it in 'ax' variable
        bottom, top = ax.get_ylim()                             # Getting the top and bottom margin limits.
        ax.set_ylim(bottom + 0.5, top - 0.5)                    # Increasing the bottom and decreasing the top margins respectively.
        st.pyplot(fig)

    if st.checkbox("Show Scatter Plot"):
        
        figure, axis = plt.subplots(2, 2,figsize=(15,10))

        sns.scatterplot(ax=axis[0,0],data=df,x='bt',y='rr')
        axis[0, 0].set_title("Body Temperature vs Respiration Rate")
  
        sns.scatterplot(ax=axis[0,1],data=df,x='sr',y='lm')
        axis[0, 1].set_title("Snoring Rate vs Limb Movement")
  
        sns.scatterplot(ax=axis[1, 0],data=df,x='bo',y='bt')
        axis[1, 0].set_title("Blood Oxygen vs Body Temperature")
  
        sns.scatterplot(ax=axis[1,1],data=df,x='sh',y='hr')
        axis[1, 1].set_title("Sleeping Hour vs Heart Rate")
        st.pyplot()

    if st.checkbox("Display Boxplot"):
        fig, ax = plt.subplots(figsize=(15,5))
        df.boxplot(['sr', 'rr', 'bt','rem','bo','sh'],ax=ax)
        st.pyplot()

    if st.checkbox("Show Sample Results"):
        safe = (df['sl'] == 0).sum()
        low = (df['sl'] == 1).sum()
        med = (df['sl'] == 2).sum()
        high = (df['sl'] == 3).sum()
        vhigh = (df['sl'] == 4).sum()
        data = [safe,low,med,high,vhigh]
        labels = ['Safe', 'Low','Medium','High','Very High']
        colors = sns.color_palette('pastel')[0:7]
        plt.pie(data, labels = labels, colors = colors, autopct='%.0f%%')
        st.pyplot()