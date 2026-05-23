/**
 * StudyHub - Upload JavaScript
 * Handles file upload and form submission
 */

document.addEventListener('DOMContentLoaded', function() {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const browseBtn = document.getElementById('browseBtn');
  const uploadPreview = document.getElementById('uploadPreview');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const progressBar = document.getElementById('progressBar');
  const removeFile = document.getElementById('removeFile');
  const uploadForm = document.getElementById('uploadForm');

  let selectedFile = null;

  // Browse button click
  if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      fileInput.click();
    });
  }

  // Upload area click
  if (uploadArea && fileInput) {
    uploadArea.addEventListener('click', function() {
      fileInput.click();
    });
  }

  // Drag and drop events
  if (uploadArea) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
      uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.remove('dragover');
      });
    });

    uploadArea.addEventListener('drop', function(e) {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    });
  }

  // File input change
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      if (this.files.length > 0) {
        handleFile(this.files[0]);
      }
    });
  }

  // Handle file selection
  function handleFile(file) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, DOCX, PPT, or PPTX file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File size must be less than 50MB.');
      return;
    }

    selectedFile = file;
    
    // Update UI
    if (fileName) fileName.textContent = file.name;
    if (fileSize) fileSize.textContent = formatFileSize(file.size);
    if (uploadPreview) uploadPreview.style.display = 'block';
    if (uploadArea) uploadArea.style.display = 'none';
    
    // Simulate progress
    simulateProgress();
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Simulate upload progress
  function simulateProgress() {
    if (!progressBar) return;
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      progressBar.style.width = progress + '%';
    }, 200);
  }

  // Remove file
  if (removeFile) {
    removeFile.addEventListener('click', function() {
      selectedFile = null;
      if (fileInput) fileInput.value = '';
      if (uploadPreview) uploadPreview.style.display = 'none';
      if (uploadArea) uploadArea.style.display = 'block';
      if (progressBar) progressBar.style.width = '0%';
    });
  }

  // Form submission
  if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!selectedFile) {
        alert('Please select a file to upload.');
        return;
      }

      const title = document.getElementById('title').value;
      const subject = document.getElementById('subject').value;
      const semester = document.getElementById('semester').value;
      const terms = document.querySelector('input[name="terms"]').checked;

      if (!title || !subject || !semester) {
        alert('Please fill in all required fields.');
        return;
      }

      if (!terms) {
        alert('Please confirm that you own these notes.');
        return;
      }

      // Simulate upload (replace with actual API call)
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('semester', semester);
      formData.append('course', document.getElementById('course').value);
      formData.append('description', document.getElementById('description').value);
      formData.append('tags', document.getElementById('tags').value);

      console.log('Uploading:', {
        file: selectedFile.name,
        title,
        subject,
        semester
      });

      alert('Notes uploaded successfully!');
      window.location.href = '/pages/dashboard.html';
    });
  }



  // Load user info on dashboard load
  // loadUserInfo();
  // const user_profile_name = document.getElementById('user-name');
  // const user_profile_email = document.getElementById('user-email');
  // if (user_profile_name && user_profile_email) {
    // Fetch user info and update the sidebar
    fetch('/api/user/profile')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
       
        
        return response.json();
      })
      .then(userData => {

        console.log('User Data:', userData);

         //calling this funtion of userUi 
        renderUser(userData.user);

        // user_profile_name.textContent = `${userData.user.firstName} ${userData.user.lastName}`;
        // user_profile_email.textContent = userData.user.email;

        // Optionally, set the avatar initials
        // const userAvatar = document.getElementById('user-avatar');
        // if (userAvatar) {
        //   const initials = `${userData.user.firstName.charAt(0)}${userData.user.lastName.charAt(0)}`;
        //   userAvatar.textContent = initials.toUpperCase();
        // }
      })
      .catch(error => {
        console.error('Error:', error )
      });
});
