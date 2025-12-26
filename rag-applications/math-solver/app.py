import streamlit as st 
from langchain_groq import ChatGroq
from langchain.chains import LLMMathChain, LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.utilities import WikipediaAPIWrapper
from langchain.agents.agent_types import AgentType
from langchain.agents import Tool, initialize_agent
from dotenv import load_dotenv
from langchain.callbacks import StreamlitCallbackHandler


st.set_page_config(page_title="Text to Math Solver")
st.title("Text to Math solver using Gemma 2")


groq_api_key = st.sidebar.text_input(label="Groq API Key", type="password")


if not groq_api_key :
    st.info("Please add Groq API key")
    st.stop()
    

model = ChatGroq(model="Gemma2-9b-It", groq_api_key=groq_api_key)


wiki = WikipediaAPIWrapper()

# Wrap it as a Tool
wiki_tool = Tool(
    name="Wikipedia",
    func=wiki.run,  # Make sure you're using .run
    description="A tool for searching the internet for various math problems and general knowledge."
)

math_chain = LLMMathChain.from_llm(llm=model)
calculator = Tool(
    name = "Calculator",
    func = math_chain.run,
    description="A tools for answering math related questions."
)


prompt = PromptTemplate(
    template="""
    You are an agent for solving uses Mathematical questions logically and explain the process point wise for the question below \n\n{question},
    
    """,
    input_variables=['question']
)


chain = LLMChain(llm=model, prompt=prompt)

reasoning_tool = Tool(
    name="reasoning",
    func=chain.run,
    description="a tool for answering logic based reasoning"
)


assistant_agent = initialize_agent(
    tools=[wiki_tool, calculator, reasoning_tool],
    llm=model,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=False,
    handle_parsing_errors=True
)


if "messages" not in st.session_state:
    st.session_state['messages']=[
        {'role':'assistant', 'content':'Hi, i am a Math chatbot and i will help you in solving Math reasoning questions'},
        
    ]
    
    
for msg in st.session_state.messages:
    st.chat_message(msg['role']).write(msg['content'])
    

def generate_response(user_question):
    response = assistant_agent.invoke({'input':user_question})
    return response


question = st.text_area("Enter your questin")
if st.button('Find my answer'):
    if question:
        with st.spinner("Generating response"):
            st.session_state.messages.append({"role":"user", "content":question})
            st.chat_message("user").write(question)
            
            
            st_cb=StreamlitCallbackHandler(st.container(), expand_new_thoughts=False)
            response = assistant_agent.run(question, callbacks=[st_cb])

            
            st.session_state.messages.append({'role':'assistant', 'content':response})
            
            st.write('### Response :')
            st.success(response)
            
            
    else:
        st.warning("Please enter an input")
