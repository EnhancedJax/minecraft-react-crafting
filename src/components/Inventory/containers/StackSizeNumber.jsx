export default function StackSizeNumber({ count }) {
  return (
    <>
      {count > 1 && (
        <div className="absolute text-2xl rounded pointer-events-none -bottom-2 -right-[6px] text-neutral-800">
          {count}
          <span className="absolute -top-[3px] -left-[3px] text-white rounded">
            {count}
          </span>
        </div>
      )}
    </>
  );
}
