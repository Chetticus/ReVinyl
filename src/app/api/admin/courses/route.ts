import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form data
    const courseData = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      level: formData.get('level') as string,
      price: Number(formData.get('price')),
      duration: formData.get('duration') as string,
      maxStudents: Number(formData.get('maxStudents')),
      tags: JSON.parse((formData.get('tags') as string) || '[]'),
      status: formData.get('status') as 'draft' | 'published',
      thumbnail: formData.get('thumbnail') as File | null,
    };

    // Basic validation
    if (!courseData.title || !courseData.description || !courseData.category) {
      return NextResponse.json(
        { error: 'Tiêu đề, mô tả và danh mục là bắt buộc' },
        { status: 400 }
      );
    }

    // Handle thumbnail upload (if any)
    const thumbnailUrl = '/api/placeholder/300/200'; // Default placeholder
    if (courseData.thumbnail && courseData.thumbnail.size > 0) {
      // Here you would implement actual file upload logic
      // For now, we'll use a placeholder
      console.log(
        'Thumbnail file:',
        courseData.thumbnail.name,
        courseData.thumbnail.size
      );

      // Example: Save to public/uploads folder
      // const buffer = Buffer.from(await courseData.thumbnail.arrayBuffer());
      // const filename = `${Date.now()}-${courseData.thumbnail.name}`;
      // await fs.writeFile(`public/uploads/${filename}`, buffer);
      // thumbnailUrl = `/uploads/${filename}`;
    }

    // Create course object with generated ID and timestamp
    const newCourse = {
      id: generateCourseId(),
      ...courseData,
      thumbnail: thumbnailUrl,
      lessons: 0,
      tests: 0,
      exercises: 0,
      createdAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      updatedAt: new Date().toISOString(),
    };

    // Here you would save to your database
    // For demonstration, we'll just return the created course
    console.log('Creating course:', newCourse);

    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      {
        message: 'Chuyên đề đã được tạo thành công',
        course: newCourse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tạo Chuyên đề' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // This would fetch courses from database
  // For now, return empty array
  return NextResponse.json({
    courses: [],
    total: 0,
  });
}

function generateCourseId(): string {
  return `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
