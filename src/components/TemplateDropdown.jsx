import React from 'react'
import Swal from 'sweetalert2'

export default function TemplateDropdown({ 
  templates, 
  onSelectTemplate,
  onAddNew,
  onDeleteTemplate,
  onEditTemplate
}) {
  // Separate built-in templates from saved templates
  const builtInTemplates = templates.filter(t => !t.isSaved)
  const savedTemplates = templates.filter(t => t.isSaved)

  const handleDelete = (template) => {
    Swal.fire({
      title: 'Delete Template?',
      text: `Are you sure you want to delete "${template.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteTemplate(template.id)
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `"${template.name}" has been deleted.`,
          confirmButtonColor: '#667eea',
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  return (
    <div className="relative group">
      <button className="btn btn-warning px-[18px] py-[10px] rounded-[10px] cursor-pointer text-[14px] font-medium transition-all duration-300 ease flex items-center gap-2 border-none bg-gradient-to-r from-warning to-warning-light text-white shadow-btn-warning hover:shadow-btn-warning-hover hover:-translate-y-0.5">
        <span>📋</span> Resume Templates
        {savedTemplates.length > 0 && (
          <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-xs">
            {savedTemplates.length}
          </span>
        )}
      </button>
      <div className="
        absolute top-full left-0 
        mt-2 
        bg-white 
        rounded-xl 
        shadow-menu 
        overflow-hidden 
        hidden 
        group-hover:block 
        z-[100] 
        min-w-[280px] 
        p-2.5 
        max-h-[400px] 
        overflow-y-auto
      ">
        {/* Built-in Templates */}
        {builtInTemplates.map(template => (
          <div 
            key={template.id} 
            className="
              p-3 
              cursor-pointer 
              transition-all duration-200 ease 
              flex 
              items-center 
              gap-3 
              text-[14px] 
              rounded-lg 
              mb-1
              hover:bg-gradient-to-r hover:from-primary hover:to-primary-dark hover:text-white
            "
            onClick={() => onSelectTemplate(template.id)}
          >
            <div 
              className="w-10 h-[50px] rounded border border-[#ddd] flex-shrink-0"
              style={{ background: template.preview }}
            ></div>
            <span>{template.name}</span>
          </div>
        ))}

        {/* Saved Templates */}
        {savedTemplates.length > 0 && (
          <>
            <div className="border-t border-[#e0e0e0] mt-2 pt-2 mb-1">
              <span className="text-xs text-[#666] font-medium px-3">★ Saved Templates</span>
            </div>
            {savedTemplates.map(template => (
              <div 
                key={template.id} 
                className="
                  p-3 
                  cursor-pointer 
                  transition-all duration-200 ease 
                  flex 
                  items-center 
                  gap-2 
                  text-[14px] 
                  rounded-lg 
                  mb-1
                  hover:bg-gradient-to-r hover:from-warning hover:to-warning-light hover:text-white
                  group/template
                "
                onClick={() => onSelectTemplate(template.id)}
              >
                <div 
                  className="w-10 h-[50px] rounded border border-[#ddd] flex-shrink-0"
                  style={{ background: template.preview }}
                ></div>
                <span className="flex-1">{template.name}</span>
                <button
                  className="opacity-0 group-hover/template:opacity-100 p-1 hover:bg-blue-500 hover:text-white rounded transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditTemplate(template.id)
                  }}
                  title="Edit template"
                >
                  ✏️
                </button>
                <button
                  className="opacity-0 group-hover/template:opacity-100 p-1 hover:bg-red-500 hover:text-white rounded transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(template)
                  }}
                  title="Delete template"
                >
                  🗑️
                </button>
              </div>
            ))}
          </>
        )}

        <div 
          className="
            border-t border-[#e0e0e0] 
            mt-1 
            pt-2.5 
            text-primary 
            cursor-pointer
            p-3
            rounded-lg
            transition-all duration-200 ease
            hover:bg-[rgba(102,126,234,0.1)]
          "
          onClick={onAddNew}
        >
          + Add New Template
        </div>
      </div>
    </div>
  )
}

