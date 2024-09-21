'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faReply, faPen, faTrash, faLink, faTag, faChevronDown,
  faBold, faItalic, faUnderline, faStrikethrough,
  faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify,
  faListUl, faListOl, faIndent, faOutdent,
  faImage, faVideo, faSmile } from '@fortawesome/free-solid-svg-icons';

const TextEditor = ({ initialContent = '', onSave }) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    onSave(content);
  };

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const ToolbarButton = ({ icon, command, value = null }) => (
    <button
      className="p-2 hover:bg-gray-100 rounded"
      onClick={() => execCommand(command, value)}
      type="button"
    >
      <FontAwesomeIcon icon={icon} className="w-4 h-4 text-gray-600" />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="border rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center border-b p-2 space-x-1">
          <ToolbarButton icon={faBold} command="bold" />
          <ToolbarButton icon={faItalic} command="italic" />
          <ToolbarButton icon={faUnderline} command="underline" />
          <ToolbarButton icon={faStrikethrough} command="strikeThrough" />
          <div className="border-r mx-2 h-6"></div>
          <ToolbarButton icon={faAlignLeft} command="justifyLeft" />
          <ToolbarButton icon={faAlignCenter} command="justifyCenter" />
          <ToolbarButton icon={faAlignRight} command="justifyRight" />
          <ToolbarButton icon={faAlignJustify} command="justifyFull" />
          <div className="border-r mx-2 h-6"></div>
          <ToolbarButton icon={faListUl} command="insertUnorderedList" />
          <ToolbarButton icon={faListOl} command="insertOrderedList" />
          <ToolbarButton icon={faIndent} command="indent" />
          <ToolbarButton icon={faOutdent} command="outdent" />
          <div className="border-r mx-2 h-6"></div>
          <ToolbarButton icon={faLink} command="createLink" />
          <ToolbarButton icon={faImage} command="insertImage" />
          <ToolbarButton icon={faVideo} command="insertVideo" />
          <ToolbarButton icon={faSmile} command="insertEmoji" />
        </div>
        <textarea
          className="w-full p-2 min-h-[200px] border focus:outline-none resize-y"
          value={content}
          onChange={handleChange}
          dir="ltr"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div className="flex items-center">
          <span className="mr-2">Attachments</span>
          <button className="text-blue-500" type="button">+</button>
        </div>
        <div>
          <button className="px-4 py-2 text-red-500 mr-2" onClick={() => onSave(null)} type="button">Cancel</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleSave} type="button">Save</button>
        </div>
      </div>
    </div>
  );
};

const Comment = ({ comment, onReply, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [commentContent, setCommentContent] = useState(comment.content);

  const handleSave = (newContent) => {
    if (newContent !== null) {
      setCommentContent(newContent);
      onUpdate(comment.id, newContent);
    }
    setIsEditing(false);
  };

  const handleReply = (replyContent) => {
    if (replyContent !== null) {
      onReply(comment.id, replyContent);
    }
    setIsReplying(false);
  };

  return (
    <div className="flex items-start space-x-4 mb-4">
      <div className="flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-700">{comment.author.charAt(0)}</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-sm flex justify-between items-center">
          <div>
            <span className="font-medium text-gray-900">{comment.author}</span>
            <span className="text-gray-500 ml-2">{new Date(comment.date).toLocaleString()}</span>
          </div>
          <div className="flex space-x-4 text-gray-500">
            <button className="hover:text-blue-600" type="button">
              <FontAwesomeIcon icon={faThumbsUp} className="w-4 h-4" />
            </button>
            <button className="hover:text-blue-600" onClick={() => setIsReplying(!isReplying)} type="button">
              <FontAwesomeIcon icon={faReply} className="w-4 h-4" />
            </button>
            <button className="hover:text-blue-600" type="button">
              <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
            </button>
            <button className="hover:text-blue-600" type="button">
              <FontAwesomeIcon icon={faTag} className="w-4 h-4" />
            </button>
            <button className="hover:text-blue-600" onClick={() => setIsEditing(!isEditing)} type="button">
              <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
            </button>
            <button className="hover:text-blue-600" onClick={() => onDelete(comment.id)} type="button">
              <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-700">
          <p>{commentContent}</p>
        </div>
        {isEditing && (
          <div className="mt-4">
            <TextEditor initialContent={commentContent} onSave={handleSave} />
          </div>
        )}
        {isReplying && (
          <div className="mt-4">
            <TextEditor initialContent="" onSave={handleReply} />
          </div>
        )}
        {comment.replies && comment.replies.map(reply => (
          <Comment key={reply.id} comment={reply} onReply={onReply} onDelete={onDelete} onUpdate={onUpdate} />
        ))}
      </div>
    </div>
  );
};

const CommentSection = ({ taskId }) => {
  const [activeTab, setActiveTab] = useState('comments');
  const [comments, setComments] = useState([]);
  const [isNewCommentEditorOpen, setIsNewCommentEditorOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [taskInfo, setTaskInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCurrentUser();
    if (taskId) {
      fetchComments();
      fetchTaskInfo();
    }
  }, [taskId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:8000/current_user', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const user = await response.json();
      setCurrentUserEmail(user.email);
    } catch (error) {
      setError('Failed to fetch current user. Please try again later.');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}/comments`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      setError('Failed to fetch comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTaskInfo(data);
    } catch (error) {
      setError('Failed to fetch task information. Please try again later.');
    }
  };

  const handleNewCommentSave = async (newContent) => {
    if (newContent !== null) {
      try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newContent,
            author: currentUserEmail,
            task_id: taskId,
            date: new Date().toISOString(),
          }),
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const newComment = await response.json();
        setComments(prevComments => [newComment, ...prevComments]);
      } catch (error) {
        setError('Failed to save the comment. Please try again later.');
      }
    }
    setIsNewCommentEditorOpen(false);
  };

  const handleReply = async (parentId, replyContent) => {
    if (replyContent !== null) {
      try {
        const response = await fetch(`http://localhost:8000/comments/${parentId}/reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: replyContent,
            author: currentUserEmail,
            task_id: taskId,
            date: new Date().toISOString(),
          }),
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        await fetchComments(); // Refresh comments after adding a reply
      } catch (error) {
        setError('Failed to reply to the comment. Please try again later.');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/comments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await fetchComments(); // Refresh comments after deletion
    } catch (error) {
      setError('Failed to delete the comment. Please try again later.');
    }
  };

  const handleUpdate = async (id, newContent) => {
    try {
      const response = await fetch(`http://localhost:8000/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newContent,
          author: currentUserEmail,
          task_id: taskId,
          date: new Date().toISOString(),
        }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await fetchComments(); // Refresh comments after update
    } catch (error) {
      setError('Failed to update the comment. Please try again later.');
    }
  };

  const openNewCommentEditor = () => {
    setIsNewCommentEditorOpen(true);
  };

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="w-3/4 ml-64 bg-white shadow rounded-lg">
      {taskInfo && (
        <div className="p-4 border-b">
          <h2 className="text-3xl font-semibold pb-2 border-b">{taskInfo.title}</h2>
          <div className="flex justify-between mt-2">
            <span className={`text-gray-500 font-semibold ${isToday(taskInfo.due_date) ? 'text-red-500 ' : ''}`}>
              Due Date {new Date(taskInfo.due_date).toLocaleString()}
            </span>
            <span className={`px-2 py-1 rounded ${
              taskInfo.status === 'Complete' ? 'bg-green-200 text-green-800' :
              taskInfo.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' :
              'bg-gray-200 text-gray-800'
            }`}>
              {taskInfo.status}
            </span>
          </div>
        </div>
      )}

      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'comments' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('comments')}
          type="button"
        >
          Comments
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'history' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('history')}
          type="button"
        >
          History
        </button>
        <div className="flex-grow"></div>
        <button className="px-4 py-2 text-gray-500">
          <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
        </button>
      </div>

      {activeTab === 'comments' && (
        <div className="p-4">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {loading ? (
            <div>Loading comments...</div>
          ) : (
            comments.map(comment => (
              <Comment key={comment.id} comment={comment} onReply={handleReply} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))
          )}

          <div className="flex items-center w-[95%] mt-8 space-x-8 p-2 bg-gray-200 rounded-lg shadow">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-gray-700">{currentUserEmail ? currentUserEmail.charAt(0).toUpperCase() : '?'}</span>
            </div>
            <input
              type="text"
              placeholder="Write a comment here..."
              className="flex-grow bg-transparent outline-none text-gray-600 placeholder-gray-400"
              onClick={openNewCommentEditor}
              readOnly
            />
          </div>

          {isNewCommentEditorOpen && (
            <div className="mt-4">
              <TextEditor initialContent="" onSave={handleNewCommentSave} />
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-4">
          <p>History content goes here</p>
        </div>
      )}
    </div>
  );
};

const CommentsPage = () => {
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');

  return (
    <div>
      {taskId ? <CommentSection taskId={taskId} /> : <p>No task ID provided</p>}
    </div>
  );
};

export default CommentsPage;
